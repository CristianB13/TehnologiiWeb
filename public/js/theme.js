class Theme {
    constructor(buttonColor, mainColor, formColor,  inputColor, backgroundUrl, icon, menuColor){
        this.buttonColor = buttonColor;
        this.mainColor = mainColor;
        this.formColor = formColor;
        this.backgroundUrl = backgroundUrl;
        this.icon = icon;
        this.inputColor = inputColor;
        this.menuColor = menuColor;
    }
}
let mainTheme = new Theme("#301545", "#fffffe", "rgba(255,192,173, 0.3)", "rgba(48,21,69, 0.5)","url(../images/darkBackground.webp)", "fa-sun", "rgba(232,143,137, 0.7)")
let secondTheme = new Theme("#e88f89", "#fffffe", "rgba(22,16,28, 0.3)", "rgba(232,143,137,0.5)", "url(../images/lightBackground.webp)", "fa-moon", "rgba(35,28,39,0.7)")

let theme = localStorage.getItem('theme')
if(theme == 'dark' || theme == null) {
    document.getElementById('theme').getElementsByTagName('i')[0].classList.remove('fa-moon');
    document.getElementById('theme').getElementsByTagName('i')[0].classList.add('fa-sun');
    setTheme(mainTheme);
    localStorage.setItem('theme', 'dark');
} else {
    document.getElementById('theme').getElementsByTagName('i')[0].classList.remove('fa-sun');
    document.getElementById('theme').getElementsByTagName('i')[0].classList.add('fa-moon');
    setTheme(secondTheme);
    localStorage.setItem('theme', 'light');
}

function setTheme(theme) {
    const root = document.documentElement
    root.style.setProperty('--button-color', theme.buttonColor);
    root.style.setProperty('--main-color', theme.mainColor);
    root.style.setProperty('--form-color', theme.formColor);
    root.style.setProperty('--background-url', theme.backgroundUrl);
    root.style.setProperty('--input-background', theme.inputColor);
    root.style.setProperty('--menu-color', theme.menuColor);
    root.style.setProperty('--logo', theme.logo);
}

function changeTheme() {
    if(localStorage.getItem('theme') == 'dark') {
        document.getElementById('theme').getElementsByTagName('i')[0].classList.remove('fa-sun');
        document.getElementById('theme').getElementsByTagName('i')[0].classList.add('fa-moon');
        setTheme(secondTheme);
        localStorage.setItem('theme', 'light');
    }
    else {
        document.getElementById('theme').getElementsByTagName('i')[0].classList.remove('fa-moon');
        document.getElementById('theme').getElementsByTagName('i')[0].classList.add('fa-sun');
        setTheme(mainTheme);
        localStorage.setItem('theme', 'dark');
    }
}