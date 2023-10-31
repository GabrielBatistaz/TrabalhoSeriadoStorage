import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Itens } from 'src/app/model/entities/itens/Itens';
import { FirebaseService } from 'src/app/model/services/firebase.service';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  nome! : string;
  lancamento! : number;
  diretor! : string;
  temporadas!: number;
  genero! : number;
  imagem : any;
  

  constructor(private alertController: AlertController,
    private router : Router, private firebase : FirebaseService){
      
    }
  
  ngOnInit() {

  }
  uploadFile(imagem:any){
    this.imagem = imagem.files;
  }

  cadastro(){
    if(this.nome){
      let novo : Itens = new Itens(this.nome);
      novo.lancamento = this.lancamento;
      novo.diretor = this.diretor;
      novo.temporadas = this.temporadas;
      novo.genero = this.genero;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo)
        ?.then(()=> {
          this.router.navigate(["/home"]);
        })
      }else{
        this.firebase.cadastro(novo)
        .then(() => this.router.navigate(["/home"]))
        .catch((error) => {
          console.log(error);
          this.presentAlert("Erro", "Erro ao salvar Série!");
        })
      }
    }else{
      this.presentAlert("Erro", "Nome é um campo Obrigatório!");
    }
  }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Séries',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
