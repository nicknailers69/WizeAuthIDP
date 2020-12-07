/**
 * @description Language ISO Tag
 * @url https://tools.ietf.org/html/rfc5646
 */

export type RFC5646 = {
    lang_tag:string;
    language:string;
    ext_lang:string;
    script:string;
    region:string;
    variant:string;
    extension:string;
    singleton:string;
    private_use:string;
    grandfathered?:string;
    irregular?:string;
}
