import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Ressource, InformationSurRessource } from './ressource';
import { RessourceService } from './ressourceService';


import { Project } from './project';
import { ProjectService } from './projectservice';
import { trigger,state,style,transition,animate } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  projects: Project[]=[];
  ressources: Ressource[] = [];
  constructor(private ressourceService: RessourceService,private ProjectService: ProjectService) { }
  //constructor(private primengConfig: PrimeNGConfig) {};
  ngOnInit() {
    // this.primengConfig.ripple = true;
   /* this.ressourceService.getRessourceData().then(data => {
    this.ressources = data;
      this.ressources.forEach(element => {
        this.ProjectService.getprojectsWithOrdersSmall().then(data =>{ 
            //this.projects = data;
            element.projects=data;
          });
      });
    });*/
   var result = this.ressourceService.getRessourceDataFromAzureDevOps().then(data => {

   
    this.ressources = data;
    console.log("Result from appcomponent");
    console.log(data);
   /*   this.ressources.forEach((ressource:any) => {
        var sumNiveauDeCharge= ressource.projects.reduce((acc:any, project:any) => acc + project.niveauDeCharge, 0)/ressource.projects.length;
        ressource.pourcentageDeCharge = sumNiveauDeCharge/ressource.projects.length;
    });*/
   });
    
    
  }

  title = 'App';

  calculateressourceTotal(name:any) {
    let total = 0;

    if (this.ressources) {
        for (let ressource of this.ressources) {
            if (ressource.informationSurRessource!=undefined && ressource.informationSurRessource.name === name) {
                total++;
            }
        }
    }

    return total;
}
ramdom(){
  return Math.floor(Math.random() * 101);
}

}
