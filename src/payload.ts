import {Constants} from "./constants";
import {COLORS} from "./colors";
import { Code128Reader } from "@zxing/library";

enum CertificateType {
    Vaccination = 'Vaccine Record',
}

enum TextAlignment {
    right = 'PKTextAlignmentRight',
}

interface Field {
    key: string;
    label: string;
    value: string;
    textAlignment?: string;
}

export interface PassDictionary {
    headerFields: Array<Field>;
    primaryFields: Array<Field>;
    secondaryFields: Array<Field>;
    auxiliaryFields: Array<Field>;
    backFields: Array<Field>;
}

export interface PatientResource {
    fullUrl: string;
    resource: {
        birthDate: string;
        name: Array<{
            family: string;
            given: Array<string>;
        }>;
        resourceType: string;
    }
}

export interface ImmunizationResource {
    fullUrl: string;
    resource: {
        lotNumber: string;
        occurrenceDateTime: string;
        patient: {
            reference: string;
        };
        performer: Array<{
            actor: {
                display: string;
            };
        }>;
        resourceType: string;
        status: string;
        vaccineCode: {
            coding: Array<{
                code: string;
                system: string;
            }>;
        };
    };
}

export interface VerifiableCredentials {
    credentialSubject: {
        fhirBundle: {
            resourceType: string;
            type: string;
            entry: [PatientResource, ImmunizationResource, ImmunizationResource?];
        };
        fhirVersion: string;
    };
    type: Array<string>;
}

export interface DecodedData {
    iss: string;
    nbf: number;
    vc: VerifiableCredentials;
}

export interface PayloadBody {
    color: COLORS;
    rawData: string;
    decodedData: DecodedData;
}

export class Payload {
    certificateType: CertificateType;

    rawData: string;

    backgroundColor: string;
    labelColor: string;
    foregroundColor: string;
    img1x: Buffer;
    img2x: Buffer;
    dark: boolean;

    generic: PassDictionary;

    constructor(body: PayloadBody) {

        const dark = body.color != COLORS.WHITE;
        const resources = body.decodedData.vc.credentialSubject.fhirBundle.entry;
        const patient: PatientResource = resources[0];
        const dose1: ImmunizationResource = resources[1];
        const dose2: ImmunizationResource = resources[2];

        if (!patient || !dose1) {
            throw new Error('certificateData');
        }

        // Get name and date of birth information
        const nameInformation = patient.resource.name;
        const dateOfBirth = patient.resource.birthDate;

        if (nameInformation == undefined) {
            throw new Error('nameMissing');
        }
        if (dateOfBirth == undefined) {
            throw new Error('dobMissing');
        }

        const firstName = nameInformation[0].given.join(' ');
        const lastName = nameInformation[0].family;

        const transliteratedFirstName = firstName.replaceAll('<', ' ');
        const transliteratedLastName = lastName.replaceAll('<', ' ');

        // Check if name contains non-latin characters
        const nameRegex = new RegExp('^[\\p{Script=Latin}\\p{P}\\p{M}\\p{Z}]+$', 'u');

        let name: string;

        if (nameRegex.test(firstName) && nameRegex.test(lastName)) {
            name = `${firstName} ${lastName}`;
        } else {
            name = `${transliteratedFirstName} ${transliteratedLastName}`;
        }

        this.certificateType = CertificateType.Vaccination;

        // See https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
        // TODO: Generate this list from URL above
        const vaccineCodes = {
            "207": {
                description: "SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 100 mcg/0.5mL dose",
                name: "Moderna / Spikevax",
            },
            "208": {
                description: "SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 30 mcg/0.3mL dose",
                name: "Pfizer / Comirnaty",
            },
            "212": {
                description: "SARS-COV-2 (COVID-19) vaccine, vector non-replicating, recombinant spike protein-Ad26, preservative free, 0.5 mL",
                name: "Johnson & Johnson's Janssen",
            },
        };

        const vaccineCode = dose1.resource.vaccineCode.coding[0].code;
        const dateOfVaccination = dose2?.resource.occurrenceDateTime || dose1.resource.occurrenceDateTime;

        // Not handling single dose vaccines or dual vaccine injections, nor test / recovery certificates for now
        // Assume both doses were performed by the same provider
        // this.certificateType = CertificateType.Test;
        // this.certificateType = CertificateType.Recovery;

        const backFields = [
            {
                key: "vaccine_details",
                label: "Vaccine details",
                value: vaccineCodes[vaccineCode].description,
            },
            {
                key: "disclaimer",
                label: "Disclaimer",
                value: "This certificate is not a travel document. It is only valid in combination with the ID card of the certificate holder and may expire one year + 14 days after the last dose. The validity of this certificate was not checked by CovidPass."
            },
            {
                key: "lot_number_dose_1",
                label: "Lot number (first dose)",
                value: dose1.resource.lotNumber,
            },
            {
                key: "date_dose_1",
                label: "Occurence date (first dose)",
                value: dose1.resource.occurrenceDateTime,
            },
        ];
        if (dose1.resource.performer && dose1.resource.performer[0]) {
            backFields.push({
                key: "performer_dose_1",
                label: "Performer (first dose)",
                value: dose1.resource.performer[0].actor.display,
            });
        }
        
        if (dose2) {
            backFields.push(
                {
                    key: "lot_number_dose_2",
                    label: "Lot number (second dose)",
                    value: dose2.resource.lotNumber,
                },
                {
                    key: "date_dose_2",
                    label: "Occurence date (second dose)",
                    value: dose2.resource.occurrenceDateTime,
                },
            );
            if (dose2.resource.performer && dose2.resource.performer[0]) {
                backFields.push({
                    key: "performer_dose_2",
                    label: "Performer (second dose)",
                    value: dose1.resource.performer[0].actor.display,
                });
            }
        }

        // Generate pass data
        this.generic = {
            headerFields: [],
            primaryFields: [
                {
                    key: "name",
                    label: "Name",
                    value: name
                }
            ],
            secondaryFields: [
                {
                    key: "dose",
                    label: "Dose(s)",
                    value: dose2 ? "2" : "1",
                },
                {
                    key: "dov",
                    label: "Date of Vaccination",
                    value: dateOfVaccination,
                    textAlignment: TextAlignment.right,
                },
            ],
            auxiliaryFields: [
                {
                    key: "vaccine",
                    label: "Vaccine",
                    value: vaccineCodes[vaccineCode].name,
                },
                {
                    key: "dob",
                    label: "Date of Birth",
                    value: dateOfBirth,
                    textAlignment: TextAlignment.right,
                }
            ],
            backFields,
        };

        // Set Values
        this.rawData = body.rawData;

        this.backgroundColor = dark ? body.color : COLORS.WHITE
        this.labelColor = dark ? COLORS.WHITE : COLORS.GREY
        this.foregroundColor = dark ? COLORS.WHITE : COLORS.BLACK
        this.img1x = Constants.img1x
        this.img2x = Constants.img2x
        this.dark = dark;
    }
}
