import { useTranslations } from "next-intl";
import {getMessages} from 'next-intl/server';


export default function NotFound(){
    const t = useTranslations('NotFoundPage');
    return(
        <h1>{t('title')}</h1>
    )
}