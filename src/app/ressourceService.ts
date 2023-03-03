import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project';
import { Ressource } from './ressource';


    const pat = 'kwufnzdxo5m3ct7btd2vqapmjdehjjs4sx7ic7u5xjozct66ll6a';
    const orgName = 'BAL-Digital';
    const projectName = '1890c76f-0434-49b0-b510-3315b79c47d6';


    const baseUrl = `https://analytics.dev.azure.com/BAL-Digital/_odata/v3.0-preview/WorkItems?$filter=(WorkItemType eq 'User Story' or WorkItemType eq 'Bug' or WorkItemType eq 'Task') and AssignedToUserSK ne null&$expand=AssignedTo($select=UserName),Iteration($select=IterationPath),Area($select=AreaPath),Project($select=ProjectName)
    `;
    const httpOptions = {
        headers: new HttpHeaders({
          Authorization: `Basic ${btoa(`:${pat}`)}`,
        }),
      };

      let ressources: Ressource[];

@Injectable()
export class RessourceService {
    constructor(private http: HttpClient) { }
    
public async getRessourceDataFromAzureDevOps() {
        // Exécute une requête GET avec les en-têtes HTTP définis
        return this.http.get<any>(baseUrl, httpOptions)
        .toPromise()
        .then( data => {

            //Ici c'est la liste des workItems :User Story, bug et task
            let items: any[]=data.value;

            //-----------Ici on procède à un régroupement par utilisateur------------
                const tasksByUser = items.reduce((acc, task) => {
                    const userKey = `${task.AssignedToUserSK}:${task.AssignedTo.UserName}`;
                    if (!acc[userKey] && task.AssignedTo!=null) {
                    acc[userKey] = {
                        AssignedToUserSK: task.AssignedToUserSK,
                        AssignedTo: task.AssignedTo?.UserName,
                        tasks: []
                    };
                    }
                    acc[userKey].tasks.push(task);
                    return acc;
                }, {});
              
                console.log("tasksByUser");
                console.log(tasksByUser);
            //-----------------------------------------------------------------------

            let Ressources: Ressource[]=[];

            //------------------- Pour chaque utilisateur on récupérer les infos des projets sur lesquels il travail-------------------------------------------------------
            Ressources =  this.loopUsers(tasksByUser, Ressources);

            let result:any=Ressources;
            return result; 
        });;
    }

    private  loopUsers(tasksByUser: any, Ressources: Ressource[]) {
        let tasksByUserConvertedInArray = Object.values(tasksByUser);
        tasksByUserConvertedInArray.forEach( (user: any) => {
            //On initialise l'objet de l'utiisateur courant
            let _Ressource: Ressource = {
                id: user.AssignedToUserSK,
                pourcentageDeCharge: 50,
                informationSurRessource: {
                    name: user.AssignedTo,
                    image: 'ionibowcher.png'
                },
                projects: []
            };
            //--------------------------------------------
            //---------------On regroupe les workItems de l'utilisateur courant par projet-------------------------------------------------------------
            let tasksItems: any[] = user.tasks;
            let tasksByProjectOfUser = tasksItems.reduce((acc, obj) => {
                const key = `${obj.ProjectSK}:${obj.Project.ProjectName}`;
                if (!acc[key] && obj.Project != null) {
                    acc[key] = {
                        ProjectSK: obj.ProjectSK,
                        ProjectName: obj.Project?.ProjectName,
                        objs: []
                    };
                }
                acc[key].objs.push(obj);
                return acc;
            }, {});

            console.log("tasksByProjectOfUser :" + user.AssignedTo);
            console.log(tasksByProjectOfUser);

            //-----------------Récupérer les info de chacun des projets identifiés dans le régroupement précédent -----------------
            let tasksByProjectOfUserConvertedInArray = Object.values(tasksByProjectOfUser);
            _Ressource =  this.loopAllProjectsForUser(tasksByProjectOfUserConvertedInArray, _Ressource);
            //--------------------------------------------------------------------------------------------------------------------
            //----------------------------------------------------------------------------------------------------------------------------------
            let totalCapacityOfAllProject = _Ressource.projects.reduce((acc, project: any) => acc + project?.capacity ?? 0, 0);

            console.log("totalCapacityOfAllProject");
            console.log(totalCapacityOfAllProject);

            let totalniveauDeChargeOfAllProject = _Ressource.projects.reduce((acc, project: any) => acc + project?.niveauDeCharge ?? 0, 0);

            console.log("totalniveauDeChargeOfAllProject");
            console.log(totalniveauDeChargeOfAllProject);

            //var rst=((Number(totalniveauDeChargeOfAllProject)*100) /totalCapacityOfAllProject).toFixed(1)
            var rst = totalniveauDeChargeOfAllProject / _Ressource.projects.length;
            _Ressource.pourcentageDeCharge = Number(rst.toString());

            Ressources.push(_Ressource);

        });

        console.log("Ressources");
        console.log(Ressources);

        return  Ressources;
    }

    private  loopAllProjectsForUser(tasksByProjectOfUserConvertedInArray: unknown[], _Ressource: Ressource) {
        tasksByProjectOfUserConvertedInArray.forEach( (project: any) => {

            //A ce stade on n'a les infos partiel (Id,Nom) du projet courant pour l'utilisateur courant
            //On initialise un objet de type projet pour receuillir les infos du projet courant
            const Project: Project = {
                id: project.ProjectSK,
                name: project.ProjectName,
                description: "Description " + project.ProjectName,
                niveauDeCharge: 0,
                equipes: []
            };
            //------On va allé récupérer les infos des itérations de l'équipe principale
            let urlForProjectIterations = "https://dev.azure.com/BAL-Digital/" + project.ProjectSK + "/" + project.ProjectName + " Team" + "/_apis/work/teamsettings/iterations?api-version=6.0";

            console.log("urlForProjectIterations");
            console.log(urlForProjectIterations);

            project=  this.getProjectInfo(urlForProjectIterations, project, Project);
            //------------------------------------------------------------------------
            //----------------------------------------------------------------------------
            //---------------------------------------------------------------------------------
            _Ressource.projects.push(Project);

            
        });
        return  _Ressource;
    }

private  getProjectInfo(urlForProjectIterations: string, project: any, Project: Project) {
    //let data:any =  this.http.get<any>(urlForProjectIterations, httpOptions).toPromise();
    let data=this.getDataSynchronous(urlForProjectIterations);
        //.then(data => {

            //Ici c'est la liste des itérations du projet courant
            let iterationduProjetCourant: any = JSON.parse(data);
            console.log("itérations du projet courant " + project.ProjectName);
            console.log(iterationduProjetCourant);

            //--------------------On calculer la capacité du projet et alimentation des itérations----------------
            let equipes: any[] = [];
            let iterationduProjetCourantList:any[]=Object.values(iterationduProjetCourant.value);
            iterationduProjetCourantList.forEach((iteration: any) => {
                const dateDebut = new Date(iteration.attributes.startDate);
                const dateFin = new Date(iteration.attributes.finishDate);

                const differenceEnMs = dateFin.getTime() - dateDebut.getTime();
                const differenceEnJours = Math.round(differenceEnMs / (1000 * 60 * 60 * 24));

                console.log("differenceEnJours de l'itteration " + iteration.name); // Affiche 30
                console.log(differenceEnJours); // Affiche 30

                iteration.differenceEnJours = differenceEnJours;

                console.log(iteration);




                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formatteddateDebut = dateDebut.toLocaleDateString('fr-FR', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                const formatteddateFin = dateFin.toLocaleDateString('fr-FR', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });


                //On charge les info concernant l'itération 
                equipes.push({
                    "equipe": project.ProjectName + " Team",
                    "iteration": iteration.name,
                    "delais": formatteddateDebut + " - " + formatteddateFin,
                    "capacity": iteration.differenceEnJours * 8,
                    "niveauOccupation": 10,
                    "customer": "David James",
                    "status": "PENDING"
                });

                //-----------------------------------------
            });

            Project.equipes = equipes;



            let totalJourItteration = iterationduProjetCourantList.reduce((acc:any, iteration:any) => acc + iteration.differenceEnJours, 0);
            Project.capacity = totalJourItteration * 8;
            console.log("Project.capacity");
            console.log(Project.capacity);


            console.log("project.objs");
            console.log(project.objs);

            let projectWorkItemConvertedInArray = Object.values(project.objs);
            let totalEstimatedWorkForCurrentProject = projectWorkItemConvertedInArray.reduce((acc: any, workItem: any) => acc + (workItem?.RemainingWork ?? 0 + workItem?.CompletedWork ?? 0), 0);

            console.log("totalEstimatedWorkForCurrentProject : " + project.ProjectName);
            console.log(totalEstimatedWorkForCurrentProject);
            if (Project.capacity == 0) {
                Project.niveauDeCharge = 0;
            }

            else {
                var rst = ((Number(totalEstimatedWorkForCurrentProject) * 100) / Project.capacity).toFixed(1);
                Project.niveauDeCharge = Number(rst.toString());
            }

            console.log("Project.niveauDeCharge");
            console.log(Project.niveauDeCharge);

            Project.statut = Project.niveauDeCharge > 80 ? "Busy" : "free";
        //});

        return  Project;
}


getDataSynchronous(url:string ) {
    const username = "";
    const password = "myPassword";
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` 
    request.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pat));
    //makes the request synchronous
    request.send();

    if (request.status === 200) {
        return request.response;
    } else {
        throw new Error('request failed');
    }
}
getRessourceData() {
    return this.http.get<any>('assets/ressourcces-medium.json')
        .toPromise()
        .then(res => <Ressource[]>res.data)
        .then(data => { return data; });
}

  
}