import {useTranslation} from 'next-i18next';
import Link from 'next/link'

function Logo(): JSX.Element {
    const { t } = useTranslation('common');

    return (
        <Link href="/">
            <a className="flex flex-row items-center">
                <img
                    src="data:image/png;base64,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"
                />


                <h1 className="text-3xl font-bold ml-4">
                    {t('common:title')}
                </h1>
            </a>
        </Link>
    )
}

export default Logo
