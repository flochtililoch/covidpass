import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);

    const title = 'CovidPass';
    const description = 'Add your California Digital COVID Vaccine Record to your Apple Wallet®.';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: process.env.BASE_URL,
                    title: title,
                    description: description,
                    images: [
                        {
                            url: `${process.env.BASE_URL}/thumbnail.png`,
                            width: 1000,
                            height: 500,
                            alt: description,
                        }
                    ],
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
                            Add your <a className="underline" href="https://myvaccinerecord.cdph.ca.gov">California Digital COVID Vaccine Record</a> to your Apple Wallet®. Please use Safari.
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
