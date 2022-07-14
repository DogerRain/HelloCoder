<template>
    <div class="read-more-wrap"
         style="display: none; position: absolute; bottom: 0px; z-index: 9999; width: 100%; margin-top: -100px; font-family: PingFangSC-Regular, sans-serif;">
        <div id="read-more-mask"
             style="position: relative; height: 300px; background:-webkit-gradient(linear, 0 0%, 0 50%, from(rgba(255, 255, 255, 0)), to(rgb(255 255 255 / 82%)));"></div>
        <a id="read-more-btn" target="_self"
           style="position: absolute; left: 50%; top: 50%; bottom: 30px; transform: translate(-50%, -50%); width: 160px; height: 36px; line-height: 36px; font-size: 15px; text-align: center; border: 1px solid rgb(222, 104, 109); color: rgb(222, 104, 109); background: rgb(255, 255, 255); cursor: pointer; border-radius: 6px;">

            <!--阅读全文-->

            <span id="read-more-text">阅读全文</span>
            <br style="display:none;">
            <span id="read-more-text_remainder"> </span>


        </a>

        <div id="btw-modal-wrap" style="display: none;">
            <div id="btw-mask"
                 style="position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; opacity: 0.7; z-index: 999; background: rgb(0, 0, 0);"></div>
            <div id="btw-modal"
                 style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; text-align: center; font-size: 13px; background: rgb(255, 255, 255); border-radius: 10px; z-index: 9999; font-family: PingFangSC-Regular, sans-serif;">
            <span id="btw-modal-close-btn"
                  style="position: absolute; top: 5px; right: 15px; line-height: 34px; font-size: 34px; cursor: pointer; opacity: 0.2; z-index: 9999; color: rgb(0, 0, 0); background: none; border: none; outline: none;">×</span>

                <p id="btw-modal-header"
                   style="margin-top: 40px; line-height: 1.8; font-size: 13px;">
                    （为防止恶意爬虫）
                    <br>
                    扫码或搜索：<span style="color: #E9405A; font-weight: bold;">HelloCoder</span>

                    <br>发送：<span id="fustack-token" class="token"
                                 style="color: #e9415a; font-weight: bold; font-size: 17px; margin-bottom: 45px;">290992</span>
                    <br>即可<span style="color: #e9415a; font-weight: bold;">永久解锁</span>本站全部文章</p>
                <img src="/img/site/HelloCoder.png"
                     style="width: 180px; margin-top: 10px; margin-bottom: 30px; border: 8px solid rgb(230, 230, 230);">


                <div class="input-password">
                    <input id="input_password" autocomplete="off" placeholder="请输入密码">
                    <span  >
                    <a id="check_password" class="btn-password" target="_self"> 解锁 </a>
                    </span>
                    <!--<button>-->
  <!--<span class="button-content">-->
    <!--<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" fill="currentColor"></path></svg> 解锁-->
  <!--</span>-->
                    <!--</button>-->
                </div>


            </div>
        </div>


    </div>
</template>

<script>

    export default {
        name: 'LockArticle',
        data() {
            return {}
        },

        mounted: function () {
            // 定时任务

            // if (this.isLock()) {
            //     let $article = this.articleObj();
            //     this._detect($article, this);
            // }

            setInterval(() => {
                if (this.isLock()) {
                    let $article = this.articleObj();
                    this._detect($article, this);
                }
            }, 1500);


            // 判断是否锁定文章
            /*if (this.isLock()) {
                setTimeout(() => {
                    let $article = this.articleObj();
                    this._detect($article, this);

                    // 定时任务
                    setInterval(() => {
                        this._detect($article, this);
                    }, 50000);

                }, 2000);
            }*/

        },
        methods: {
            isLock() {
                return "need" === this.$page.frontmatter.lock;
            },

            slef_password() {
                return this.$themeConfig.selfPassword;
            },

            articleObj: function () {
                let $article = $('.theme-vdoing-content');


                // 文章的实际高度
                let height = $article[0].clientHeight;

                if ($article.length <= 0 || height === undefined) {
                    height = 0;
                }

                return {
                    article: $article,
                    height: height
                }
            },
            _detect: function (articleObj, t) {
                // if (null == articleObj) return;


                let res = this.getCookie("_unlock");
                if ('success' === res) {
                    return;
                } else {
                    t._lock(articleObj, this);
                    return;
                }


            },
            _lock: function (articleObj, t) {
                let $article = articleObj.article;
                let height = articleObj.height;
                if ($article.length <= 0) return;

                // 文章隐藏后的高度
                let halfHeight = height * 0.3;

                // 篇幅短一点的文章就不需要解锁了
                if (this.os().isPc && halfHeight > 800) {

                    let remainder = (height - 800) / height;

                    remainder = parseInt(remainder * 100);

                    remainder = remainder.toString().concat("%");


                    let text_remainder = "（剩余" + remainder + "）";

                    $('#read-more-text_remainder').text(text_remainder);


                    // 获取口令
                    this.getToken().then(function (token) {
                        $('#fustack-token').text(token);

                        // 判断是否已解锁锁
                        if ($article.hasClass("lock")) {

                            return;
                        }

                        //开始加锁

                        // 设置文章可显示高度
                        $article.css({"height": halfHeight + 'px'});
                        $article.addClass('lock');

                        // 添加引导解锁标签 # 阅读全文
                        $article.remove("#read-more-wrap");

                        let clone = $('.read-more-wrap').clone();
                        clone.attr('id', 'read-more-wrap');
                        clone.css('display', 'block');


                        let clone2 = $('.right-menu-content').clone();
                        clone2.css('pointer-events', 'none');


                        // readOj = document.getElementById('message_read_more');


                        //绑定点击事件

                        clone.find("#read-more-btn").click(function () {
                            clone.find("#btw-modal-wrap").css('display', 'block');
                        });

                        clone.find("#btw-modal-close-btn").click(function () {
                            clone.find("#btw-modal-wrap").css('display', 'none');
                        });

                        clone.find("#check_password").click(function () {
                            var value = document.getElementById('input_password').value;

                            if (value === null || value === '') {
                                return
                            }

                            if (value.toUpperCase() === t.slef_password().toUpperCase()) {
                                t._unlock(articleObj);
                                t.setCookie("_unlock", "success", 1);
                            } else {
                                alert("密码错误")
                            }

                        });

                        $article.append(clone);
                    });

                }
            },
            _unlock: function (articleObj) {

                let $article = articleObj.article;

                // 判断是否已加锁
                if (!$article.hasClass("lock")) {
                    return;
                }

                $article.css('height', 'initial');
                $article.removeClass('lock');

                $('#right-menu-content').css('pointer-events', 'auto');

                $('#read-more-wrap').remove();

                //目录变成可用
                $article.css('pointer-events', 'auto');


            },
            getToken: async function () {
                // 浏览器 Cookie true 不限制
                /*if(navigator.cookieEnabled){
                    let value = this.getCookie('UM_distinctid');
                    if (!value) {
                        return await this.getFingerprintId();
                    }
                    return value.substring(value.length - 6).toUpperCase();
                } else{
                    return await this.getFingerprintId();
                }*/
                return '密码'
                // return await this.getFingerprintId();
            },
            getFingerprintId: function () {
                // https://github.com/fingerprintjs/fingerprintjs
                /* new Fingerprint2().get(function(result, components){
                     let value = result.toUpperCase();
                     let token = value.substring(value.length - 6).toUpperCase();
                     // 设置token
                     $('#fustack-token').text(token);
                 });
                 return $('#fustack-token').text();*/
                return new Promise(resolve => {
                    new Fingerprint2().get(function (result, components) {
                        let value = result.toUpperCase();
                        let token = value.substring(value.length - 6).toUpperCase();
                        resolve(token);
                    });
                })
            },
            getUUID: function () {
                return 'xxxxxx'.replace(/[xy]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            getCookie: function (name) {
                let value = "; " + document.cookie;
                let parts = value.split("; " + name + "=");
                if (parts.length === 2)
                    return parts.pop().split(";").shift();
            },
            setCookie: function (name, value, hours) {
                let exp = new Date();
                exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
                // ;path=/ cookie全站有效
                document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
            },
            os: function () {
                let ua = navigator.userAgent,
                    isWindowsPhone = /(?:Windows Phone)/.test(ua),
                    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
                    isAndroid = /(?:Android)/.test(ua),
                    isFireFox = /(?:Firefox)/.test(ua),
                    isChrome = /(?:Chrome|CriOS)/.test(ua),
                    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
                    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
                    isPc = !isPhone && !isAndroid && !isSymbian;
                return {
                    isTablet: isTablet,
                    isPhone: isPhone,
                    isAndroid: isAndroid,
                    isPc: isPc
                }
            },

            //
            // checkPassword: function() {
            //
            //     alert("点击");
            //
            //     //    获取输入框内容
            //     let inputValue =  document.getElementById('input_password');
            //     let articleObj = this.articleObj();
            //     if (inputValue ==='milk'){
            //         this.setCookie("_unlock", "success", 1)
            //         this._unlock(articleObj);
            //     }else{
            //         this._lock(articleObj)
            //         alert("密码错误")
            //     }
            //
            // },
            // buttonClickMethod: function() {
            //     alert("这是show1的方法");
            // },
            //
            // clickFullscreen1(){
            //     console.log("11214")
            //     alert("clickFullscreen1")
            //
            // }
        },

    };


</script>


<style lang="stylus">
    #read-more-btn {
        border: none !important;
        text-decoration: none;
        background: #3eaf7c !important;
    }

    #read-more-btn {
        color: #fff !important;
        transition: all .5s ease;
    }

    #read-more-btn:hover {
        background: #de3636 !important;
    }

    .lock {
        position: relative;
        overflow: hidden;
        padding-bottom: 30px;
    }


    .input-password {
        margin-bottom: 1rem;
        display:inline-block;
    }

    .input-password input {
        cursor: text;
        width: 8rem;
        height: 2rem;
        color: #4e6e8e;
        display: inline-block;
        border: 1px solid #cfd4db;
        border-radius: 2rem;
        font-size: 0.9rem;
        line-height: 2rem;
        padding: 0 0.5rem 0 2rem;
        outline: none;
        transition: all 0.2s ease;
        background: #fff url(/img/svg/password.svg) 0.6rem 0.5rem no-repeat;
        background-size: 1.2rem;
    }

    .btn-password {
        display: inline-block;
        padding: 0.2rem 0.4rem;
        transition: all 0.4s;
        background-color: #3eaf7c !important;
        color: var(--mainBg);
        border-radius: 0.5rem;
        margin: 0 0.3rem 0.5rem 0;
        min-width: 2rem;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 1.1rem;
        text-align: center;
    }

   /* !* From www.lingdaima.com *!
    button {
        font-size: 16px;
        display:inline-block
        font-family: inherit;
        font-weight: 700;
        padding: 4px;
        border-radius: 20px;
        border: none;
        color: black;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        background: linear-gradient(0deg, rgba(255,213,0,1) 0%, rgba(255,213,0,1) 47%, rgba(0,91,187,1) 47%, rgba(0,91,187,1) 100%);
    }

    button .button-content {
        display: flex;
        align-items: center;
        background: white;
        padding: 0.7em 1.5em;
        padding-left: 1.2em;
        border-radius: 16px;
    }

    button svg {
        width: 22px;
        height: 22px;
        margin-right: 6px;
        color: #ff0000;
        transition: transform 0.3s;
    }

    button:hover svg {
        transform: scale(1.2);
    }*/



</style>

