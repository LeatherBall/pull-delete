/**
 * PullDelete
 * 左滑删除
 */
(function(win, $) {
    var startX, // 起始点X
        startY, // 起始点Y
        pullX,  // 结束点X
        pullY,  // 结束点Y
        moveX,  // X轴拖动距离
        moveY,  // Y轴拖动距离
        rem,    // css单位
        btn,    // 删除按钮宽度
        threshold; // 拖动阈值
    var _this;

    /**
     *
     * @param $Dom
     * @param callback
     * @constructor
     */
    var PullDelete = function ($Dom, callback) {
        _this = this;
        rem = parseFloat($('html').css('font-size').replace('px', '')),
        btn = 2.5 * rem;
        threshold = btn / 2;
        if ($Dom instanceof jQuery && $Dom.hasClass('pull_delete')) {
            $Dom.append('<i class="pd_btn"></i>');
            _this.addPullListener($Dom, callback);
        }
    }


    PullDelete.prototype = {
        constructor: PullDelete,
        addPullListener: function($Dom, callback) {
            $Dom.on('touchstart', function (e) {
                startX = e.originalEvent.targetTouches[0].pageX;
                startY = e.originalEvent.targetTouches[0].pageY;
                $(this).removeClass('trans');
                $(this).siblings().addClass('trans').css({transform: 'translateX(0)'}); // 收起其他项
            });
            $Dom.on('touchmove', function (e) {
                pullX = e.originalEvent.targetTouches[0].pageX;
                pullY = e.originalEvent.targetTouches[0].pageY;
                moveX = (startX - pullX) * 0.8;
                moveY = (startY - pullY) * 0.8;
                // 阻止纵向推拽
                if (Math.abs(moveY) > Math.abs(moveX)) {
                    return;
                }
                if (moveX <= btn) {
                    $(this).css({transform: 'translateX(-' + moveX + 'px)'});
                }
            });
            $Dom.on('touchend', function (e) {
                var trans = _this.transverseShift($(this)),
                    viewTrans = trans >= threshold && trans < btn ? btn : 0; // 阈值范围内视为有效推拽
                $(this).addClass('trans').css({transform: 'translateX(-' + viewTrans + 'px)'});
                // 点击删除
                if (e.target.className == 'pd_btn') {
                    e.stopPropagation();
                    e.preventDefault();
                    if (callback) {
                        callback($Dom);
                    }
                }
            });
        },
        transverseShift: function($dom) {
            if (!$dom instanceof jQuery) {
                return;
            }
            var trans = $dom.css('transform');
            if (trans.indexOf('matrix') > -1) {
                return Math.abs(trans.split(',')[4]) || 0;
            } else {
                return Math.abs(trans.replace(/[^\d\.]/g, '')) || 0;
            }
        }
    }

    $.fn.extend({
        pulldelete: function(callback){
            this.each(function(){
                new PullDelete($(this), callback);
            });
            return this;
        }
    });

    win.PullDelete = PullDelete;
})(window, jQuery)
