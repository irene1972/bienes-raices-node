import {Dropzone} from 'dropzone';

Dropzone.options.imagen={
    dictDefaultMessage:'Sube tus imágenes aquí',
    acceptedFiles:'.png,.jpg,.jpeg',
    maxFilesize:5,   //5 megas
    maxFiles:1,
    paralleUploads:1,
    autoProcessQueue:false,
    addRemoveLinks:true,
    dictRemoveFile:'Borrar Archivo',
    dictMaxFilesExceeded:'El límite es 1 archivo'
}