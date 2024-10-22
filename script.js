// 获取用户输入的数，以逗号分隔
let numbers = [];
let num = 0;
let sta = 0;
let now = 0;
//显示输入的数
const elements = document.querySelectorAll('.element');
const nodes = document.querySelectorAll('.node');
const lens = document.querySelectorAll('.line');

function init() {

    elements.forEach((element, index) => {
        if (index < numbers.length) {
            element.style.display = 'block';
            element.textContent = numbers[index];
        }
        else {
            element.style.display = 'none';
        }
        element.style.visibility = 'visible';
    });

}
async function up(j) {
    nodes[j].style.color = 'white';
    // console.log(j);
    if (j == 0) return;
    let k = Math.floor((j - 1) / 2);
    // console.log(nodes[j].textContent, nodes[k].textContent);
    if (parseInt(nodes[j].textContent) > parseInt(nodes[k].textContent)) {
        // console.log('swap');
        let temp = nodes[j].textContent;
        nodes[j].textContent = nodes[k].textContent;
        nodes[k].textContent = temp;
        nodes[k].style.color = 'green';
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await up(k);
    }
}
async function fixTree() {
    for (let i = num - 1; i >= 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await up(i);
    }
}

function makeTree() {
    if (sta == 0) {

        if (now < num) {
            // nodes[now].style.display = 'block';
            nodes[now].textContent = numbers[now];
            nodes[now].style.visibility = 'visible';
            if (now > 0) lens[now - 1].style.visibility = 'visible';
            elements[now].style.visibility = 'hidden';
            now++;
        }
        else {
            sta = 1;
            now--;
            fixTree();
        }
    }
    if (sta == 0) setTimeout(makeTree, 0);
}
function getUserInput() {
    const input = prompt("请输入一些数，以逗号分隔:");
    //12, 3, 7, 1, 15, 10, 5, 8, 14, 2, 6, 11, 9, 4, 13
    numbers = input.split(',').map(Number);
    num = numbers.length;
    // console.log(numbers);
    // console.log(num);
    init();

}

// 调用函数获取用户输入
getUserInput();
makeTree();