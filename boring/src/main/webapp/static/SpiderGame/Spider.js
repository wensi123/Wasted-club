class Spider {
    constructor() {
        this.cntr = $("#main");
        this.scoreElem = $("#score");
        this.stepElem = $("#step");
        this.paddingTop = 10;
        this.init();
    }

    init() {
        this.score = 500;
        this.step = 0;
        this.closeCollection = [];
        this.openCollection = Array(10).fill().map(() => []);
        this.doneCollection = [];
        this.readyCollection = [];
        this.historyQueue = [];
        this.distanceArr = Array(10).fill(20);

        // 创建52*2张牌
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                this.closeCollection.push({ pos: -1, style: i, num: j });
                this.closeCollection.push({ pos: -1, style: i, num: j });
            }
        }

        // 洗牌
        this.closeCollection = this.shuffleCards(this.closeCollection);

        // 创建占位符和牌堆
        this.createPlaceholdersAndDeck();
    }

    shuffleCards(cards) {
        let shuffled = cards.sort(() => Math.random() - 0.5);
        let cutIndex = Math.floor(Math.random() * (shuffled.length / 2 - 1)) + 1;
        let cut = shuffled.splice(cutIndex, shuffled.length / 3);
        return shuffled.concat(cut);
    }

    createPlaceholdersAndDeck() {
        // 创建占位符
        for (let i = 0; i < 10; i++) {
            let poker = new Poker(this, { pos: i + 1, style: 4, num: 3 });
            this.openCollection[i].push(poker);
        }

        // 创建牌堆
        for (let i = 0; i < 5; i++) {
            let poker = new Poker(this, { pos: 0, style: 4, num: 0 });
            poker.offset((4 - i) * 10, 0);
            poker.elem.css("z-index", 900 + i);
            this.readyCollection.push(poker);
        }
    }

    start() {
        this.record();
        let delay = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 10; j++) {
                if (i == 5 && j == 4) break;
                let mode = this.closeCollection.shift();
                let pos = j + 1;
                mode.pos = pos;
                let poker = (i == 4 && j >= 4) || i == 5
                    ? new Poker(this, mode)
                    : new Poker(this, { pos: pos, style: 4, num: 0 });
                let offset = poker.offset(0, 10 * i);
                poker.elem.css({ left: "990px", top: "390px" });
                poker.moveTo(offset.left, offset.top, delay);
                this.openCollection[j].push(poker);
                poker.mode = mode;
                delay += 60;
            }
        }
        setTimeout(() => {
            let poker = this.readyCollection[this.readyCollection.length - 1];
            poker.enable();
        }, delay);
    }

    continuous(poker, group) {
        group = group || this.openCollection[poker.mode.pos - 1];
        let i = group.length - 1;
        do {
            let poker1 = group[i];
            if (poker && poker1 == poker) {
                return true;
            }
            let poker2 = group[i - 1];
            if (poker1.mode.style != poker2.mode.style || poker1.mode.num != poker2.mode.num - 1) {
                return false;
            }
            if (!poker && poker2.mode.num == 12) {
                return i - 1;
            }
            i--;
        } while (i > 0);
        return false;
    }

    dealing(P) {
        if (P.elem.is(".fixed")) {
            return;
        }
        let delay = 0;
        for (let i = 0; i < 10; i++) {
            let mode = this.closeCollection.shift();
            mode.pos = i + 1;
            let j = this.openCollection[i].length;
            let lastPoker = this.openCollection[i][j - 1];
            let offset = lastPoker.soliOffset();
            let poker = new Poker(this, mode);
            poker.elem.css({ left: "990px", top: "390px" });
            poker.moveTo(offset.left, offset.top, delay);
            delay += 60;
            this.openCollection[i][j] = poker;
        }
        setTimeout(() => {
            let delPoker = this.readyCollection.pop();
            delPoker.elem.remove();
            if (this.readyCollection.length > 0) {
                let poker = this.readyCollection[this.readyCollection.length - 1];
                poker.enable();
            }
        }, delay);
        this.historyQueue.push("dealing");
    }

    record() {
        this.scoreElem.html(this.score);
        this.stepElem.html(this.step);
    }

    folding(pos) {
        let group = this.openCollection[pos];
        let i = group.length - 1;
        let poker = group[i];
        if (poker.mode.num != 0) {
            return;
        }
        let index = this.continuous(null, group);
        if (!index) {
            return;
        }
        let x = 50 + this.doneCollection.length * 110;
        let y = 390;
        let delay = 0;
        for (; i >= index; i--) {
            poker = group[i];
            poker.elem.css("z-index", 900 - i);
            poker.disable();
            poker.mode.pos = 11;
            poker.moveTo(x, y, delay);
            delay += 5;
        }
        this.doneCollection.push(group.splice(index));
        poker = group[index - 1];
        if (poker.elem.is(".fixed")) {
            setTimeout(() => {
                poker.expose();
            }, delay);
        }
        this.score += 101;
        this.record();
        this.historyQueue[this.historyQueue.length - 1].unshift({ pos: pos + 1, poker: "folding", fixed: false });
        if (this.doneCollection.length == 8) {
            this.win();
        }
    }

    adjustDistance(pos) {
        let distance = 20;
        let group = this.openCollection[pos];
        if (group.length < 3) {
            return;
        }
        if (group.length > 18) {
            distance = 360 / (group.length - 5);
            this.distanceArr[pos] = distance;
        } else {
            distance = 30;
            this.distanceArr[pos] = 20;
        }
        let y = this.paddingTop;
        for (let i = 1; i < group.length; i++) {
            let poker = group[i];
            if (poker.elem.is(".fixed")) {
                y += 10;
            } else {
                poker.elem.css("top", y + "px");
                y += distance;
            }
        }
    }

    undo() {
        if (this.historyQueue.length == 0) {
            return;
        }
        let historyArr = this.historyQueue.pop();
        if (historyArr === "dealing") {
            for (let i = 9; i >= 0; i--) {
                let poker = this.openCollection[i].pop();
                let mode = poker.mode;
                mode.pos = -1;
                this.closeCollection.unshift(mode);
                poker.elem.remove();
                this.adjustDistance(i);
            }
            let poker = new Poker(this, { pos: 0, style: 4, num: 0 });
            poker.offset((4 - this.readyCollection.length) * 10, 0);
            poker.elem.css("z-index", 900 + this.closeCollection.length);
            this.readyCollection.push(poker);
            poker.enable();
            if (this.readyCollection[this.readyCollection.length - 2]) {
                this.readyCollection[this.readyCollection.length - 2].disable();
            }
        } else {
            for (let i = 0; i < historyArr.length; i++) {
                let hy = historyArr[i];
                if (hy.fixed == true) {
                    let poker = hy.poker;
                    if (poker.mode.style != 4 || poker.mode.num != 3) {
                        poker.elem.css("background-position", "0px " + (-148 * 4) + "px");
                        poker.disable();
                    }
                } else if (hy.poker == "folding") {
                    let group = this.doneCollection[this.doneCollection.length - 1];
                    let prevCollection = this.openCollection[hy.pos - 1];
                    let lastPoker = prevCollection[prevCollection.length - 1];
                    let offset = lastPoker.soliOffset();
                    let toX = offset.left;
                    let toY = offset.top;
                    for (let j = 0; j < group.length; j++) {
                        let poker = group[j];
                        poker.elem.css({
                            left: toX + "px",
                            top: toY + "px",
                            zIndex: ""
                        });
                        poker.enable();
                        toY += this.distanceArr[hy.pos - 1];
                        poker.elem.appendTo(this.cntr);
                        poker.mode.pos = hy.pos;
                        prevCollection.push(poker);
                    }
                    this.doneCollection.pop();
                    this.adjustDistance(hy.pos - 1);
                } else {
                    let poker = hy.poker;
                    let prevCollection = this.openCollection[hy.pos - 1];
                    let lastPoker = prevCollection[prevCollection.length - 1];
                    let offset = lastPoker.soliOffset();
                    poker.elem.css({
                        left: offset.left + "px",
                        top: offset.top + "px"
                    });
                    poker.elem.appendTo(this.cntr);
                    prevCollection.push(poker);
                    this.openCollection[poker.mode.pos - 1].pop();
                    this.adjustDistance(poker.mode.pos - 1);
                    this.adjustDistance(hy.pos - 1);
                    poker.mode.pos = hy.pos;
                }
            }
        }
    }

    replay() {
        $("#pop").hide();
        $(".poker").remove();
        this.init();
        this.start();
    }

    win() {
        $("#pop").delay(200).fadeIn();
    }
}

class Poker {
    constructor(S, mode) {
        this.S = S;
        this.elem = null;
        this.width = 105;
        this.height = 148;
        this.mode = mode || { pos: 0, style: 4, num: 0 };
        this.init();
    }

    init() {
        this.render();
        if (this.mode.style == 4) {
            this.disable();
        }
        this.listener();
    }

    render() {
        this.elem = $("<div class='poker'></div>");
        let css = {
            "background-position": `${-(this.width * this.mode.num)}px ${-(this.height * this.mode.style)}px`
        };
        if (this.mode.pos == 0) {
            css.left = "950px";
            css.top = "390px";
        } else {
            css.left = `${50 + 110 * this.mode.pos - 110}px`;
            css.top = `${this.S.paddingTop}px`;
        }
        this.elem.css(css);
        this.S.cntr.append(this.elem);
    }

    moveTo(x, y, delay) {
        this.elem.delay(delay).animate({ left: x + "px", top: y + "px" }, "fast");
    }

    offset(left, top) {
        left = left || 0;
        top = top || 0;
        let _left = parseInt(this.elem.css("left"));
        let _top = parseInt(this.elem.css("top"));
        this.elem.css({
            left: (_left + left) + "px",
            top: (_top + top) + "px"
        });
        return { left: _left + left, top: _top + top };
    }

    soliOffset() {
        let pos = this.mode.pos - 1;
        let offset = this.offset();
        let toY;
        if (this.elem.is(".fixed")) {
            toY = offset.top + 10;
            if (this.mode.style == 4 && this.mode.num == 3) {
                toY = offset.top;
            }
        } else {
            toY = this.S.paddingTop + offset.top + this.S.distanceArr[pos];
        }
        return {
            left: offset.left,
            top: toY
        };
    }

    disable() {
        this.elem.addClass("fixed");
    }

    enable() {
        this.elem.removeClass("fixed");
    }

    expose() {
        if (this.mode.style == 4 && this.mode.num == 3) {
            return;
        }
        this.enable();
        this.elem.css("background-position", `${-(this.width * this.mode.num)}px ${-(this.height * this.mode.style)}px`);
        this.listener();
        this.S.historyQueue[this.S.historyQueue.length - 1].unshift({ pos: this.mode.pos, poker: this, fixed: true });
    }

    listener() {
        this.elem.unbind("click").unbind("mousedown");
        if (this.mode.pos == 0) {
            this.elem.bind("click", () => {
                this.S.dealing(this);
            });
        } else if (this.mode.style != 4) {
            this.elem.bind("mousedown", (event) => {
                if (this.elem.is(".fixed")) {
                    return;
                }
                this.dragStart(this, event);
            });
        }
    }

	dragStart(P, event) {
        let S = this.S;
        if (S.moving === true) {
            return;
        }
        if (!S.continuous(P)) {
            return;
        }
        S.moving = true;

        S.dragBox = $("<div class='drag_box'></div>").appendTo(S.cntr);
        let css = {
            left: parseInt(P.elem.css("left")),
            top: parseInt(P.elem.css("top")),
            zIndex: 999
        };
        let pos = P.mode.pos - 1;
        let group = S.openCollection[pos];
        let index = group.indexOf(P);

        for (let i = index; i < group.length; i++) {
            let poker = group[i];
            let top = parseInt(poker.elem.css("top"));
            poker.elem.css({ top: (top - css.top) + "px", left: "0px" });
            S.dragBox.append(poker.elem);
        }

        S.dragCollection = group.splice(index);
        S.soliPoker = group[index - 1];

        css.left += 1;
        css.top += 1;
        S.dragBox.css(css);

        S.startX = event.pageX;
        S.startY = event.pageY;

        S.adjustDistance(pos);

        $(document).bind("mousemove.drag", (event) => {
            this.draging(event, P);
        });

        $(document).bind("mouseup.drag", () => {
            this.dragEnd(P);
        });
    }

    draging(event, P) {
        let S = this.S;
        let moveX = event.pageX - S.startX;
        let moveY = event.pageY - S.startY;
        let left = parseInt(S.dragBox.css("left"));
        let top = parseInt(S.dragBox.css("top"));
        S.dragBox.css({
            left: (left + moveX) + "px",
            top: (top + moveY) + "px"
        });
        S.startX = event.pageX;
        S.startY = event.pageY;
    }

    dragEnd(P) {
        let S = this.S;
        let left = parseInt(S.dragBox.css("left"));
        let top = parseInt(S.dragBox.css("top"));
        let soliPoker = this.findSoliPoker(left, top) || S.soliPoker;
        
        let pos = soliPoker.mode.pos;
        let soliOffset = soliPoker.soliOffset();
        let toX = soliOffset.left;
        let toY = soliOffset.top;

        S.dragBox.animate({ left: `${toX}px`, top: `${toY}px` }, "fast", null, () => {
            let historyArr = [];
            S.moving = false;
            S.dragCollection.forEach(poker => {
                historyArr.push({ pos: poker.mode.pos, poker: poker, fixed: false });
                poker.offset(toX, toY);
                poker.mode.pos = pos;
                S.cntr.append(poker.elem);
                S.openCollection[pos - 1].push(poker);
            });

            if (soliPoker != S.soliPoker) {
                S.score -= 1;
                S.step += 1;
                S.record();
                S.historyQueue.push(historyArr);
                if (S.soliPoker.elem.is(".fixed")) {
                    S.soliPoker.expose();
                }
            }
            S.dragBox.remove();
            S.dragCollection = [];
            S.folding(pos - 1);
            S.adjustDistance(pos - 1);
        });

        $(document).unbind("mouseup.drag mousemove.drag");
    }

    findSoliPoker(left, top) {
        let S = this.S;
        for (let i = 0; i < 10; i++) {
            let poker = S.openCollection[i][S.openCollection[i].length - 1];
            let offset = poker.offset();
            if (left > offset.left - 50 && left < offset.left + 105 &&
                top > offset.top - 50 && top < offset.top + 105) {
                if ((poker.mode.style == 4 && poker.mode.num == 3) || poker.mode.num == (this.mode.num + 1)) {
                    return poker;
                }
            }
        }
        return null;
    }
}

// 初始化游戏
$(function() {
    window.s = new Spider();
    $("#playBtn").click(function() {
        if (this.value === "开始") {
            s.start();
            this.value = "重新开始";
        } else {
            s.replay();
        }
    });
    $("#undoBtn").click(() => s.undo());
    $("#replayBtn").click(() => s.replay());
});


