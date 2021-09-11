import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);

    const title = 'CovidPass';
    const description = 'Add your CA Digital COVID Vaccine Record to your iOS wallet app.';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://covidpass.dvlpr.xyz/',
                    title: title,
                    description: description,
                    images: [],
                    site_name: title,
                }}
                twitter={{
                    handle: '@flochtililoch',
                    site: '@flochtililoch',
                    cardType: 'summary_large_image',
                }}
            />
            <Page content={
                <div className="space-y-5">
                    <Card content={
                        <p>
                            Add your <a className="underline" href="https://myvaccinerecord.cdph.ca.gov">CA Digital COVID Vaccine Record</a> to your iOS wallet app. Please use Safari.
                        </p>
                    }/>

                    <Form/>
                </div>
            }/>
        </>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'index', 'errors'])),
        },
    };
}

export default Index;
