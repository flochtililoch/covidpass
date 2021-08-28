import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Privacy(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'privacy']);
    return (
        <Page content={
            <Card step="i" heading={t('common:credits')} content={
                <div className="space-y-3">
                    <p>
                        Credits go to <a href="https://marvinsextro.de" className="hover:underline">Marvin Sextro</a> for developing the original <a href="https://covidpass.marvinsextro.de" className="hover:underline">CovidPass</a>, which allows European citizens to add their digital COVID-19 certificates to the Apple Wallet® app.
                    </p>
                    <p>
                        The idea for this web app originated from the <a href="https://coronapass.fabianpimminger.com" className="hover:underline">solution of an Austrian web developer</a>, which only works for Austrian certificates at the moment.
                    </p>
                </div>
            }/>
        }/>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['index', 'privacy', 'common'])),
        },
    };
}

export default Privacy;
