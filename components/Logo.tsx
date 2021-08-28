import {mdiPassportBiometric} from '@mdi/js';
import {useTranslation} from 'next-i18next';

import Icon from '@mdi/react'
import Link from 'next/link'

function Logo(): JSX.Element {
    const { t } = useTranslation('common');

    return (
        <Link href="/">
            <a className="flex flex-row items-center">
                <Icon
                    path={mdiPassportBiometric}
                    title={t('common:title')}
                    size={2.3}
                    horizontal
                    vertical
                    color="black"
                />
                <h1 className="text-5xl font-bold ml-2">
                    {t('common:title')}
                </h1>
            </a>
        </Link>
    )
}

export default Logo
