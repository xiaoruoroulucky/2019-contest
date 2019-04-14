function $(selector) {            // 将原生方法抽象一下   减少代码
    return document.querySelector(selector);              //css选择器，只获取一个
}

function $$(selector) {                // 将原生方法抽象一下
    return document.getElementById(selector);
}

function main() { // 主函数
    initMap(gameData[0]);                           // 初始化第一关数据

    var select = $('select');
    var html = '';
    for(var i=0;i<=4;i++){                                  //默认为简单
        html += '<option>第' + (i + 1 )+ '关</option>';
    }
    select.innerHTML = html;
    var checks=[...document.getElementsByName("Check")];       //扩展运算符 用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
     for(var check of checks){                                //遍历数组
        check.onchange= e=> {                               //简化代码  箭头函数
             //check.onchange=function(e){
             var start,end;
             var html='';
             switch (e.target.value){                         //判断游戏难度
                 case 'easy':
                     start=0;
                     break;
                 case 'normal':
                     start=5;
                     break;
                 case 'hard':
                     start=10;
                     break;
             }
             end=start+4;
             for(var i=start;i<=end;i++){
                 html += '<option>第' + (i + 1 )+ '关</option>';
             }
             select.innerHTML=html;
            document.getElementsByClassName('lv')[0].innerHTML=start+1;
            initMap(gameData[parseInt(start)]);
        };
     }

    select.onchange = function(event) {             // 选择关卡
        initMap(gameData[parseInt(this.value.substring(1, 3)) - 1]);         //第几关转换成数字
        document.getElementsByClassName('lv')[0].innerHTML=parseInt(this.value.substring(1, 3));
        this.blur();
    };

    $('button').onclick = function(event) {               //      重试 还原到这关最开始
        initMap(gameData[parseInt(select.value.substring(1, 3)) - 1])
    };

    keyEvent();
}

function initMap(data) {                              // 画图
    var html = '';
    for (var i = 0; i < data.size.height; i++) {
        html += '<tr>';
        for (var j = 0; j < data.size.width; j++) {
            html += '<td id=' +  i + '_' + j + '></td>';     //id=i_j
        }
        html += '</tr>';
    }
    $('table').innerHTML = html;
    setMapClass(data.map);
}

function setMapClass(data) {           // 给每一个格子赋上一个类名
    keys = {
         05: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "real", // 箱子
    };

    data.forEach(function(e, i) {                          //遍历二维数组data
        e.forEach(function(e, j) {           
            $$(i + '_' + j).className = keys[e];
            $$(i + '_' + j).dataset.class = keys[e];             //取得td的属性
        });
    });
}

function keyEvent() { // 监控键盘事件
    document.onkeydown = function(event) {
        var cur = $('.man').id.split('_');                   // cur当前点
        var row = cur[0];                  //i
        var col = cur[1];                    //j
        var rows = $('table').rows.length           //行的数量
        var cols = $('table').rows[0].cells.length     //第一行的数量
        var direction;                        //direction代表移动方向
        switch(event.keyCode) {
            case 37: // 左 
                direction = 'l';
                col--;
                if (col < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col--;
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    col++;
                }
                break;
            case 38: // 上
                direction = 'u';
                row--;
                if (row < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row--;
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    row++;
                }
                break;
            case 39: // 右
                direction = 'r';
                col++;
                if (col >= cols || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col++;
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    col--;
                }
                break;
            case 40: // 下
                direction = 'd';
                row++;
                if (row >= rows || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row++;
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    row--;
                }
                break;
            default:
                break;
        }
        move(cur, [row, col], direction);
    }
}

function move(cur, next, direction) { // cur当前点 next下一点 direction代表移动方向
    var row = next[0];
    var col = next[1];
    if ($$(cur[0] + '_' + cur[1]).dataset.class == 'target') {
        $$(cur[0] + '_' + cur[1]).className = 'target';
    } else {
        $$(cur[0] + '_' + cur[1]).className = 'ground';
    }
    if ($$(next[0] + '_' + next[1]).className == 'ground' || $$(next[0] + '_' + next[1]).className == 'target') {
        $$(next[0] + '_' + next[1]).className = 'man';
    } else {
        switch(direction) {
            case 'u':
                row--;
                break;
            case 'r':
                col++;
                break;
            case 'd':
                row++;
                break;
            case 'l':
                col--;
                break;
        }
        if ($$(row + '_' + col).className == 'ground') {
            $$(row + '_' + col).className = 'real';
            $$(next[0] + '_' + next[1]).className = 'man';
        } else {
            $$(row + '_' + col).className = 'arrive';
            $$(next[0] + '_' + next[1]).className = 'man';
        }
    }
    setTimeout(function() {               //指定的毫秒数后调用函数或计算表达式
        isWin();
        isLose();
    }, 500)                              //1s
}

function isWin() { // 是否过关
    var select = $('select');
    var html = '';
    var  input=document.getElementsByTagName("input");
    if (!$('.real')) {
        var lv=document.getElementsByClassName('lv')[0].innerHTML;
        if (lv == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！');
            isWin = function(){};
        } else {
            if(lv == '5'){
                //由简单变成中等
                for(var i=5;i<=9;i++){                                  
                    html += '<option>第' + (i + 1 )+ '关</option>';
                }
                select.innerHTML = html;
                input[1].checked='true';
            }else if(lv == '10'){
                for(var i=10;i<=15;i++){                                 
                    html += '<option>第' + (i + 1 )+ '关</option>';
                }
                select.innerHTML = html;
                input[2].checked="true";
            }
                alert('恭喜你通关了, 再接再励，攻克下一关');
                var level = parseInt($('.level span').innerHTML);
                initMap(gameData[level])
                document.getElementsByClassName('lv')[0].innerHTML=level+1
                $('select').value = '第' + (level + 1) + '关';
            
        
        }
    }
}
function isLose() {
    var [...boxes]=document.getElementsByClassName('real');
    for(var box of boxes){
        var position=box.id.split('_');//当前箱子的坐标
        var top=(position[0]*1-1)+'_'+position[1];
        var bottom=(position[0]*1+1)+'_'+position[1];
        var left=position[0]+'_'+(position[1]*1-1);
        var right=position[0]+'_'+(position[1]*1+1);
        //通过判断相邻的两个方向上是不是墙来判断是否为失败。
        if($$(top).className=='wall'&&$$(left).className=='wall'){
            loseTips();
            return ;
        }
        if($$(top).className=='wall'&&$$(right).className=='wall'){
            loseTips();
            return ;
        }
        if($$(bottom).className=='wall'&&$$(left).className=='wall'){
            loseTips();
            return ;
        }
        if($$(bottom).className=='wall'&&$$(right).className=='wall'){
            loseTips();
            return ;
        }
    }
    
}
function loseTips(){    // 失败的提示
    alert('您已经失败啦，请重试本关卡。');
    initMap(gameData[parseInt(document.getElementsByClassName('lv')[0].innerHTML)-1]);
}
main();