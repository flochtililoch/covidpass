import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Page from '../components/Page'
import Card from '../components/Card'

function Privacy(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'privacy']);
    return (
        <Page content={
            <Card step="i" heading={t('common:privacyPolicy')} content={
                <div className="space-y-3">
                    <p className="font-bold text-lg">{t('privacy:generalInfo')}</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:generalInfoProcess')}</li>
                            <li>{t('privacy:generalInfoStoring')}</li>
                            <li>{t('privacy:generalInfoThirdParties')}</li>
                            <li>{t('privacy:generalInfoHttps')}</li>
                            <li>
                                {t('privacy:generalInfoLocation')}
                                &nbsp;
                                <a href="https://vercel.com" className="underline">
                                    Vercel
                                </a>.
                            </li>
                            <li>
                                {t('privacy:generalInfoGitHub')}
                                &nbsp;
                                <a href="https://github.com/flochtililoch/covidpass" className="underline">
                                    GitHub
                                </a>.
                            </li>
                            <li>
                                {t('privacy:generalInfoLockScreen')}
                                &nbsp;
                                <a href="https://support.apple.com/guide/iphone/control-access-information-lock-screen-iph9a2a69136/ios" className="underline">
                                    {t('privacy:settings')}
                                    </a>.
                            </li>
                            <li>
                                {t('privacy:generalInfoProvider')}
                                <a href="https://vercel.com/legal/privacy-policy" className="underline">
                                    {t('privacy:privacyPolicy')}
                                </a>
                                &nbsp;
                                {t('privacy:andThe')} 
                                &nbsp;
                                <a href="https://vercel.com/legal/dpa" className="underline">
                                    {t('privacy:dataPrivacyFaq')}
                                </a>.
                            </li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:process')}</p>
                    <p>{t('privacy:processFirst')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:processRecognizing')}</li>
                            <li>{t('privacy:processDecoding')}</li>
                            <li>{t('privacy:processAssembling')}</li>
                            <li>{t('privacy:processGenerating')}</li>
                            <li>{t('privacy:processSending')}</li>
                        </ul>
                    </div>
                    <p>{t('privacy:processSecond')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:processReceiving')}</li>
                            <li>{t('privacy:processSigning')}</li>
                            <li>{t('privacy:processSendingBack')}</li>
                        </ul>
                    </div>
                    <p>{t('privacy:processThird')}:</p>
                    <div className="px-5">
                        <ul className="list-disc">
                            <li>{t('privacy:processCompleting')}</li>
                            <li>{t('privacy:processSaving')}</li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:locallyProcessedData')}</p>
                    <p>
                        {t('privacy:the')}
                        &nbsp;
                        <a href="https://myvaccinerecord.cdph.ca.gov" className="underline">
                            {t('privacy:schema')}
                        </a>
                        &nbsp;
                        {t('privacy:isa')}
                        &nbsp;
                        <a href="https://spec.smarthealth.cards" className="underline">
                            {t('privacy:smartHealthCard')}
                        </a>
                        &nbsp;
                        {t('privacy:specification')}
                    </p>
                    <p className="font-bold">{t('privacy:serverProvider')}</p>
                    <p>
                        {t('privacy:serverProviderIs')}
                        &nbsp;
                        <a href="https://vercel.com" className="underline">
                            Vercel
                        </a>.
                    </p>
                    <p>{t('privacy:logFiles')}:</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>{t('privacy:logFilesBrowser')}</li>
                            <li>{t('privacy:logFilesOs')}</li>
                            <li>{t('privacy:logFilesReferrer')}</li>
                            <li>{t('privacy:logFilesTime')}</li>
                            <li>{t('privacy:logFilesIpAddress')}</li>
                        </ul>
                    </div>
                    <p className="font-bold">{t('privacy:thirdParties')}</p>
                    <div className="pl-6">
                        <ul className="list-disc">
                            <li>
                                Vercel:
                                &nbsp;
                                <a href="https://vercel.com/legal/privacy-policy" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                GitHub:
                                &nbsp;
                                <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                Ko-fi:
                                &nbsp;
                                <a href="https://more.ko-fi.com/privacy" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                            <li>
                                {t('privacy:appleSync')}:
                                &nbsp;
                                <a href="https://www.apple.com/legal/privacy/en-ww/privacy.tsx" className="underline">
                                    {t('common:privacyPolicy')}
                                </a>
                            </li>
                        </ul>
                    </div>
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
