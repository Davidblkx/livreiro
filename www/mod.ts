import './components/livreiro-home.ts';

const styleElem = document.createElement('link');
styleElem.rel = 'stylesheet';
styleElem.href = '/assets/styles.css';
document.head.appendChild(styleElem);

const elem = document.createElement('lv-home');
document.body.appendChild(elem);
