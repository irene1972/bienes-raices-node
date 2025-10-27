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
    dictMaxFilesExceeded:'El límite es 1 archivo',
    paramName:'imagen',
    init:function(){
        const dropzone=this;
        const btnPublicar=document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue();
        });

        dropzone.on('queuecomplete',function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href='/mis-propiedades';
            }
        });
    }
}