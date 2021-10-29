export interface HeadingLink {
    /* id of the section*/
    id: string;

    /* header type h1/h2/h3/h4 */
    type: string;

    /* name of the anchor */
    name: string;

    /** level of the section */
    level?: number;
}
