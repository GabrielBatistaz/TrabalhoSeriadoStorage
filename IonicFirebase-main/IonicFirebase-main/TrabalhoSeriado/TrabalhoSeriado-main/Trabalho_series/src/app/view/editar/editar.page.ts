import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Itens } from 'src/app/model/entities/itens/Itens';
import { FirebaseService } from 'src/app/model/services/firebase.service';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  nome! : string;
  lancamento! : number;
  temporadas! : number;
  diretor! : string;
  genero! : number;
  imagem! : any;
  itens! : Itens;
  edicao: boolean = true;

  constructor(private firebase : FirebaseService, private router : Router, private alertController: AlertController) {

  }

  ngOnInit() {
    this.itens = history.state.itens;
    this.nome = this.itens.nome;
    this.lancamento = this.itens.lancamento;
    this.temporadas = this.itens.temporadas;
    this.diretor = this.itens.diretor;
    this.genero = this.itens.genero;


  }

  habilitar(){
    if (this.edicao){
      this.edicao = false;
    }else {
      this.edicao = true;
    }
  }
  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }

  editar(){
    if(this.nome){
      let novo: Itens = new Itens(this.nome);
      novo.lancamento = this.lancamento;
      novo.diretor = this.diretor;
      novo.temporadas = this.temporadas;
      novo.genero = this.genero;
      novo.id = this.itens.id;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo)
        ?.then(()=>{this.router.navigate(["/home"]);})
      }else{
        novo.downloadURL = this.itens.downloadURL;
        this.firebase.editar(novo, this.itens.id)
        .then(()=>{this.router.navigate(["/home"]);})
        .catch((error)=>{
          console.log(error);
          this.presentAlert("Erro", "Erro ao Atualizar Série!");
        })
      }
    }else{
      this.presentAlert("Erro", "Nome e Telefone são campos Obrigatórios!");
    }
  }



  excluir(){
    this.presentConfirmAlert("ATENÇÃO", "Deseja realmente excluir a Série?")
  }

  excluiritens(){
    this.firebase.excluir(this.itens.id)
    .then(() => {this.router.navigate(["/home"]);})
    .catch((error) =>{
      console.log(error);
      this.presentAlert("Erro","Erro ao excluir série!")
    })
  }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Series',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentConfirmAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Series',
      subHeader: subHeader,
      message: message,
      buttons: [
        {text: 'Cancelar', role: 'cancelar', handler: ()=>{console.log("cancelou")}},
        {text: 'Confirmar', role: 'confirmar', handler: (acao)=>{this.excluiritens()}},
      ],
    });
    await alert.present();
  }

}
