import { Project } from "./project";


export interface InformationSurRessource {
    name?: string;
    image?: string;
}

export interface Ressource {
    id?: number;
    pourcentageDeCharge?: number;
    informationSurRessource?: InformationSurRessource;
    projects:Project[]
}