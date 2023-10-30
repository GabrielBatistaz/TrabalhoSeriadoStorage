import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Itens } from '../entities/itens/Itens';
import { AngularFireStorage} from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string ="series";

  constructor(private firestore:AngularFirestore,private storage:AngularFireStorage) { }

  buscarTodos(){
    return this.firestore.collection(this.PATH).snapshotChanges();
  }
  cadastro(itens:Itens){
    return this.firestore.collection(this.PATH)
    .add({nome : itens.nome,
      lancamento: itens.lancamento,
      diretor: itens.diretor,
      temporadas: itens.temporadas,
      genero: itens.genero,
      downloadURL: itens.downloadURL});
  }
  editar(itens : Itens, id:string){
    return this.firestore.collection(this.PATH).doc(id)
    .update({nome : itens.nome,
      lancamento: itens.lancamento,
      diretor: itens.diretor,
      temporadas: itens.temporadas,
      genero: itens.genero,
      downloadURL: itens.downloadURL});
  }
  excluir(id : string){
    return this.firestore.collection(this.PATH).doc(id)
    .delete();
  }
  uploadImage(imagem:any, itens:Itens){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){
      console.error("id Não suportado");
      return;
    }
    const path = `images/${itens.nome}_${file.name}`;
    const fileRef = this.storage.ref(path);
    let task = this.storage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadFileURL = fileRef.getDownloadURL();
        uploadFileURL.subscribe(resp => {
          itens.downloadURL = resp;
          if(!itens.id){
            this.cadastro(itens);
          }else{
            this.editar(itens, itens.id);
          }
        })
      })
    ).subscribe();
    return task;
  }
}
