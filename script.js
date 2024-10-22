// 获取用户输入的数，以逗号分隔
let numbers = [];
let num = 0;
let step = 0;
let now = 0;
let working = 0;
let stateStack = []; // 用于保存每一步的状态

// 显示输入的数
const elements = document.querySelectorAll('.element');
const nodes = document.querySelectorAll('.node');
const lens = document.querySelectorAll('.line');

// 创建延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    now = 0;
    step = 0;
    working = 0;
    stateStack = []; // 初始化时清空状态栈
    elements.forEach((element, index) => {
        if (index < numbers.length) {
            element.style.display = 'block';
            element.style.backgroundColor = 'blue';
            element.textContent = numbers[index];
        } else {
            element.style.display = 'none';
        }
        element.style.visibility = 'visible';
    });
    nodes.forEach((node, index) => {
        node.style.backgroundColor = 'red';
        node.style.visibility = 'hidden';
    });
    lens.forEach((line, index) => {
        line.style.visibility = 'hidden';
    });
}

function saveState() {
    const state = {
        now: now,
        step: step,
        elements: Array.from(elements).map(element => ({
            textContent: element.textContent,
            visibility: element.style.visibility,
            backgroundColor: element.style.backgroundColor,
            transform: element.style.transform,
            transition: element.style.transition
        })),
        nodes: Array.from(nodes).map(node => ({
            textContent: node.textContent,
            visibility: node.style.visibility,
            backgroundColor: node.style.backgroundColor,
            transform: node.style.transform,
            transition: node.style.transition
        })),
        lens: Array.from(lens).map(line => ({
            visibility: line.style.visibility
        }))
    };
    stateStack.push(state);
}

function restoreState() {
    if (stateStack.length === 0) return;
    const state = stateStack.pop();
    now = state.now;
    step = state.step;
    state.elements.forEach((elementState, index) => {
        elements[index].textContent = elementState.textContent;
        elements[index].style.visibility = elementState.visibility;
        elements[index].style.backgroundColor = elementState.backgroundColor;
        elements[index].style.transform = elementState.transform;
        elements[index].style.transition = elementState.transition;
    });
    state.nodes.forEach((nodeState, index) => {
        nodes[index].textContent = nodeState.textContent;
        nodes[index].style.visibility = nodeState.visibility;
        nodes[index].style.backgroundColor = nodeState.backgroundColor;
        nodes[index].style.transform = nodeState.transform;
        nodes[index].style.transition = nodeState.transition;
    });
    state.lens.forEach((lineState, index) => {
        lens[index].style.visibility = lineState.visibility;
    });
}

async function swapWithAnimation(i, j) {
    return new Promise(resolve => {
        const rectI = nodes[i].getBoundingClientRect();
        const rectJ = nodes[j].getBoundingClientRect();
        const deltaX = rectJ.left - rectI.left;
        const deltaY = rectJ.top - rectI.top;
        nodes[i].style.transition = 'transform 0.5s';
        nodes[j].style.transition = 'transform 0.5s';
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
        await delay(1);
        await swapWithAnimation(k, j);
        await up(k);
    }
}

async function down(j) {
    let k = 2 * j + 1;
    if (k >= now) return;
    if (k + 1 < now && parseInt(nodes[k].textContent) < parseInt(nodes[k + 1].textContent)) k++;
    if (parseInt(nodes[j].textContent) < parseInt(nodes[k].textContent)) {
        await delay(1);
        await swapWithAnimation(j, k);
        await down(k);
    }
}

async function fixTree() {
    for (let i = num - 1; i >= 0; i--) {
        await up(i);
    }
}

async function move2(now) {
    return new Promise(resolve => {
        // 获取元素和节点的位置
        const nodeRect = nodes[now].getBoundingClientRect();
        const elementRect = elements[now].getBoundingClientRect();

        // 计算位移
        const deltaX = elementRect.left - nodeRect.left;
        const deltaY = elementRect.top - nodeRect.top;

        // 设置动画
        nodes[now].style.transition = 'transform 0.5s';
        nodes[now].style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        if (now > 0) lens[now - 1].style.visibility = 'hidden';
        nodes[now].style.backgroundColor = 'green';

        // 在动画完成后执行
        nodes[now].addEventListener('transitionend', () => {
            elements[now].textContent = nodes[now].textContent;
            elements[now].style.visibility = 'visible';
            elements[now].style.backgroundColor = 'green';

            nodes[now].style.visibility = 'hidden';
            nodes[now].style.transform = ''; // 重置transform
            nodes[now].style.transition = ''; // 重置transition
            resolve();
        }, { once: true });
    });
}

async function getMax() {
    if (now == 0) {
        await move2(0);
        return;
    }
    await swapWithAnimation(0, now);
    await delay(1);
    await move2(now);
    await delay(1);
    await down(0);
    now--;
}

async function move1(now) {
    return new Promise(resolve => {
        // 获取元素和节点的位置
        const elementRect = elements[now].getBoundingClientRect();
        const nodeRect = nodes[now].getBoundingClientRect();

        // 计算位移
        const deltaX = nodeRect.left - elementRect.left;
        const deltaY = nodeRect.top - elementRect.top;
        elements[now].style.backgroundColor = 'red';

        // 设置动画
        elements[now].style.transition = 'transform 0.3s';
        elements[now].style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // 在动画完成后执行
        elements[now].addEventListener('transitionend', () => {
            nodes[now].textContent = numbers[now];
            nodes[now].style.visibility = 'visible';
            if (now > 0) lens[now - 1].style.visibility = 'visible';
            elements[now].style.visibility = 'hidden';
            elements[now].style.transform = ''; // 重置transform
            elements[now].style.transition = ''; // 重置transition
            resolve();
        }, { once: true });
    });
}

async function makeTree() {
    if (now < num) {
        await move1(now);
        now++;
    } else {
        sta = 1;
        now--;
        return;
    }
    await makeTree();
}

function getUserInput() {
    const input = prompt("请输入一些数，以逗号分隔:");
    numbers = input.split(',').map(Number);
    num = numbers.length;
    if (num == 1) {
        numbers = [12, 3, 7, 1, 15, 10, 5, 8, 14, 2, 6, 11, 9, 4, 13];
        num = numbers.length;
    }
}

// 调用函数获取用户输入
async function main() {
    getUserInput();

    document.querySelector('#start').addEventListener('click', async () => {
        init();
        document.querySelector('#next').addEventListener('click', async () => {
            if (working) return;

            working = 1;
            if (step == 0) {
                saveState();
                await makeTree();

                working = 0;
                step = 1;

            }
            else if (step == 1) {
                saveState();
                await fixTree();

                working = 0;
                step = 2;

            }
            else if (step >= 2) {
                saveState();
                if (now < 0) {
                    working = 0;
                    step = -1;
                    return;
                }
                await getMax();

                working = 0;
                step++;

            }
        });

        document.querySelector('#prev').addEventListener('click', async () => {
            if (working) return;
            restoreState(); // 恢复上一步状态
        });

        document.querySelector('#reset').addEventListener('click', async () => {
            if (working) return;
            init();
        });
    });
}

main();