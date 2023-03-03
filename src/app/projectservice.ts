import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Project } from './project';

@Injectable()
export class ProjectService {

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    projectNames: string[] = [
        "Bamboo Watch", 
        "Black Watch", 
        "Blue Band", 
        "Blue T-Shirt", 
        "Bracelet", 
        "Brown Purse", 
        "Chakra Bracelet",
        "Galaxy Earrings",
        "Game Controller",
        "Gaming Set",
        "Gold Phone Case",
        "Green Earbuds",
        "Green T-Shirt",
        "Grey T-Shirt",
        "Headphones",
        "Light Green T-Shirt",
        "Lime Band",
        "Mini Speakers",
        "Painted Phone Case",
        "Pink Band",
        "Pink Purse",
        "Purple Band",
        "Purple Gemstone Necklace",
        "Purple T-Shirt",
        "Shoes",
        "Sneakers",
        "Teal T-Shirt",
        "Yellow Earbuds",
        "Yoga Mat",
        "Yoga Set",
    ];

    constructor(private http: HttpClient) { }

    getprojectsSmall() {
        return this.http.get<any>('assets/projects-small.json')
        .toPromise()
        .then(res => <Project[]>res.data)
        .then(data => { return data; });
    }

    getprojects() {
        return this.http.get<any>('assets/projects.json')
        .toPromise()
        .then(res => <Project[]>res.data)
        .then(data => { return data; });
    }

    getprojectsWithOrdersSmall() {
        return this.http.get<any>('assets/projects-orders-small.json')
        .toPromise()
        .then(res => <Project[]>res.data)
        .then(data => { return data; });
    }

    generatePrduct(): Project {
        const project: Project =  {
            id: this.generateId(),
            name: this.generateName(),
            description: "project Description",
            capacity: this.generateQuantity(),
            statut: this.generateStatus(),
            niveauDeCharge: this.generateRating(),
            equipes:[]
        };

        if(project.name!=undefined)
        {
            //project.image = project.name.toLocaleLowerCase().split(/[ ,]+/).join('-')+".jpg";
        }
        return project;
    }

    generateId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text;
    }

    generateName() {
        return this.projectNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299)+1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75)+1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5)+1);
    }
}