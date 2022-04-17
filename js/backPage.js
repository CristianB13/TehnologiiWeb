function back(){
    if(history.length === 1){
        window.location = "index.html";
    }
    else{
        history.back();
    }
}