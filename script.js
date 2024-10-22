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

function work() {
    if (sta == 0) {

        if (now < nodes.length) {
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
        }
    }
    setTimeout(work, 1000);
}
function getUserInput() {
    const input = prompt("请输入一些数，以逗号分隔:");
    //12, 3, 7, 1, 15, 10, 5, 8, 14, 2, 6, 11, 9, 4, 13
    numbers = input.split(',').map(Number);
    num = numbers.length;
    // console.log(numbers);
    // console.log(num);
    init();
    work();
}

// 调用函数获取用户输入
getUserInput();