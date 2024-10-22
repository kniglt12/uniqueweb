// 获取用户输入的数，以逗号分隔
let numbers = [];
let num = 0;
let sta = 0;
let now = 0;
//显示输入的数
const elements = document.querySelectorAll('.element');
const nodes = document.querySelectorAll('.node');
const lens = document.querySelectorAll('.line');

// 创建延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    elements.forEach((element, index) => {
        if (index < numbers.length) {
            element.style.display = 'block';
            element.textContent = numbers[index];
        } else {
            element.style.display = 'none';
        }
        element.style.visibility = 'visible';
    });
}

async function swapWithAnimation(i, j) {
    return new Promise(resolve => {
        const rectI = nodes[i].getBoundingClientRect();
        const rectJ = nodes[j].getBoundingClientRect();
        const deltaX = rectJ.left - rectI.left;
        const deltaY = rectJ.top - rectI.top;
        // console.log(i, j);
        nodes[i].style.transition = 'transform 1s';
        nodes[j].style.transition = 'transform 1s';
        nodes[i].style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        nodes[j].style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;

        nodes[i].addEventListener('transitionend', () => {
            nodes[i].style.transition = '';
            nodes[j].style.transition = '';
            nodes[i].style.transform = '';
            nodes[j].style.transform = '';

            // 交换内容
            let temp = nodes[i].textContent;
            nodes[i].textContent = nodes[j].textContent;
            nodes[j].textContent = temp;

            resolve();
        }, { once: true });
    });
}

async function up(j) {
    if (j == 0) return;
    let k = Math.floor((j - 1) / 2);
    if (parseInt(nodes[j].textContent) > parseInt(nodes[k].textContent)) {
        await (delay(1));
        await swapWithAnimation(k, j);
        await up(k);
    }
}

async function down(j) {
    let k = 2 * j + 1;
    if (k >= now) return;
    if (k + 1 < now && parseInt(nodes[k].textContent) < parseInt(nodes[k + 1].textContent)) k++;
    if (parseInt(nodes[j].textContent) < parseInt(nodes[k].textContent)) {
        await (delay(1));
        await swapWithAnimation(j, k);
        await down(k);
    }
}

async function fixTree() {
    for (let i = num - 1; i >= 0; i--) {
        await up(i);
    }
    console.log('fixTree');
}

async function getMax() {
    await delay(1000);
    await swapWithAnimation(0, now);
    if (now > 0) lens[now - 1].style.visibility = 'hidden';
    nodes[now].style.visibility = 'hidden';
    elements[now].textContent = nodes[now].textContent;
    elements[now].style.visibility = 'visible';
    await down(0);
    now--;
    if (now >= 0) await getMax();
}

async function makeTree() {
    if (sta == 0) {
        if (now < num) {
            nodes[now].textContent = numbers[now];
            nodes[now].style.visibility = 'visible';
            if (now > 0) lens[now - 1].style.visibility = 'visible';
            elements[now].style.visibility = 'hidden';
            now++;
        } else {
            sta = 1;
            now--;
            await fixTree();
        }
    }
    if (sta == 0) await makeTree();
}

function getUserInput() {
    const input = prompt("请输入一些数，以逗号分隔:");
    numbers = input.split(',').map(Number);
    num = numbers.length;
    if (num == 1) {
        numbers = [12, 3, 7, 1, 15, 10, 5, 8, 14, 2, 6, 11, 9, 4, 13];
        num = numbers.length;
    }
    init();
}

// 调用函数获取用户输入
async function main() {
    getUserInput();
    await makeTree();
    await getMax();
    console.log('done');
}

main();