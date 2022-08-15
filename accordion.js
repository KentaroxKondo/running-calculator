(() => {
    // アコーディオンの挙動をクラスで定義
    class Accordion {
        constructor(obj){
            const $elm = document.querySelector(obj.hookName);
            const $trigger = $elm.getElementsByTagName(obj.tagName);

            for(let i=0; i < $trigger.length; i++){
                $trigger[i].addEventListener('click', (e) => this.clickHandler(e));
            };
        };

        clickHandler(e){
            e.preventDefault();
            const $content = e.currentTarget.nextElementSibling;
            $content.classList.toggle("show");
        };
    };

    // アコーディオンを呼び出し
    const PurposeAccordion = new Accordion({
        hookName: '#PurposeList',
        tagName: 'h2'
    });

    // h1タイトルを押下し、全アコーディオンを開閉
    const h1_title = document.getElementById("h1-title");

    h1_title.addEventListener("click", () => {
        const AllClosed = document.getElementById("PurposeList").querySelector(".show") === null
        const $AccordionContents = document.getElementsByClassName("accordion-content");

        for (i=0; i < $AccordionContents.length; i++) {
            if (AllClosed) {
                $AccordionContents[i].classList.add("show");
            } else {
                $AccordionContents[i].classList.remove("show");
            };
        };
    });

    // input[type="number"]フォームに入力桁数の制限を設ける ※HTMLの[maxlength]では指定不可のため
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.oninput = () => {
            if(input.value.length > input.maxLength) {
                input.value = input.value.slice(0, input.maxLength);
            };
        };
    });

    // --------------------距離を求める--------------------
    const distance_inputs = document.getElementsByName("distance-input");

    distance_inputs.forEach((input) => {
        input.addEventListener("input", () => {
            calculateDistance();
        });

        // 入力桁数が最大、もしくはEnter押下時にフォーカスを移動 ※TabやShift+Tab操作には干渉させない
        input.addEventListener("keyup", (e) => {
            if(e.key !== "Shift" && e.key !== "Tab") {
                if (input.value.length >= input.maxLength || e.key === "Enter") {
                    nextFocus(input, distance_inputs);
                };
            };
        });
    });

    // 距離を求める際に発火させたい関数
    const calculateDistance = () => {
        let time_hour = parseInt(document.getElementById("distance-time1").value)||0;
        let time_minute = parseInt(document.getElementById("distance-time2").value)||0;
        let time_second = parseInt(document.getElementById("distance-time3").value)||0;
        let pace_minute = parseInt(document.getElementById("distance-pace1").value)||0;
        let pace_second = parseInt(document.getElementById("distance-pace2").value)||0;

        // 時間の入力フォーム＞秒から分への繰り上げ
        if(time_second >= 60) {
            time_minute = time_minute + Math.floor(time_second/60);
            document.getElementById("distance-time2").value = time_minute;

            time_second = time_second % 60;
            document.getElementById("distance-time3").value = time_second;
        };

        // 時間の入力フォーム＞分から時間への繰り上げ
        if(time_minute >= 60) {
            time_hour = time_hour + Math.floor(time_minute/60);
            document.getElementById("distance-time1").value = time_hour;

            time_minute = time_minute % 60;
            document.getElementById("distance-time2").value = time_minute;
        };

        // ペースの入力フォーム＞秒から分への繰り上げ
        if(pace_second >= 60) {
            pace_minute = pace_minute + Math.floor(pace_second/60);
            document.getElementById("distance-pace1").value = pace_minute;

            pace_second = pace_second % 60;
            document.getElementById("distance-pace2").value = pace_second;
        };

        // 合計距離を計算し、結果が有限である（infiniteではない）場合は出力
        const total_distance = (time_hour*3600 + time_minute*60 + time_second)/(pace_minute*60 + pace_second);
        const $distance_answer = document.getElementById("distance-answer");
        const $distance_answer_box = document.getElementById("distance-answer-box");

        if(isFinite(total_distance)){
            $distance_answer.textContent = Math.round(total_distance*1000)/1000 + " KM";
            $distance_answer_box.classList.remove("hidden-answer");
        } else {
            $distance_answer.textContent = "";
            $distance_answer_box.classList.add("hidden-answer");
        };
    };

    // --------------------時間を求める--------------------
    const time_inputs = document.getElementsByName("time-input");

    time_inputs.forEach((input) => {
        input.addEventListener("input", () => {
            calculateTime(input);
        });

        // 入力桁数が最大、もしくはEnter押下時にフォーカスを移動 ※TabやShift+Tab操作には干渉させない
        input.addEventListener("keyup", (e) => {
            if(e.key !== "Shift" && e.key !== "Tab") {
                if (input.value.length >= input.maxLength || e.key === "Enter") {
                    nextFocus(input, time_inputs);
                };
            };
        });
    });

    // 時間を求める際に発火させたい関数
    const calculateTime = (FormInput) => {
        const distance_km = parseFloat(document.getElementById("time-distance1").value)||0;
        let pace_minute = parseInt(document.getElementById("time-pace1").value)||0;
        let pace_second = parseInt(document.getElementById("time-pace2").value)||0;

        // 距離の小数点以下は2桁までとする
        if(FormInput.value.indexOf(".") !== -1 && FormInput.value.split(".")[1].length >= 2) {
            nextFocus(FormInput, time_inputs);
        };

        // ペースの入力フォーム＞秒から分への繰り上げ
        if(pace_second >= 60) {
            pace_minute = pace_minute + Math.floor(pace_second/60);
            document.getElementById("time-pace1").value = pace_minute;

            pace_second = pace_second % 60;
            document.getElementById("time-pace2").value = pace_second;
        };

        // 合計時間を計算し、答えが1秒以上の場合に出力
        const total_time = Math.round(distance_km*(pace_minute*60 + pace_second));
        const $time_answer = document.getElementById("time-answer");
        const $time_answer_box = document.getElementById("time-answer-box");

        if (distance_km === 0) {
            $time_answer_box.classList.add("hidden-answer");
        } else if (0 < total_time && total_time < 60) {
            $time_answer.textContent = total_time + "秒";
            $time_answer_box.classList.remove("hidden-answer");
        } else if (60 <= total_time && total_time < 3600) {
            $time_answer.textContent = `${Math.floor(total_time/60)}分 ${total_time % 60}秒`;
            $time_answer_box.classList.remove("hidden-answer");
        } else if (3600 <= total_time) {
            $time_answer.textContent = `${Math.floor(total_time/3600)}時間 ${Math.floor(total_time/60) % 60}分 ${total_time % 60}秒`;
            $time_answer_box.classList.remove("hidden-answer");
        };
    };

    // --------------------ペースを求める--------------------
    const pace_inputs = document.getElementsByName("pace-input");

    pace_inputs.forEach((input) => {
        input.addEventListener("input", () => {
            calculatePace(input);
        });

        // 入力桁数が最大、もしくはEnter押下時にフォーカスを移動 ※TabやShift+Tab操作には干渉させない
        input.addEventListener("keyup", (e) => {
            if(e.key !== "Shift" && e.key !== "Tab") {
                if (input.value.length >= input.maxLength || e.key === "Enter") {
                    nextFocus(input, pace_inputs);
                };
            };
        });
    });

    // ペースを求める際に発火させたい関数
    const calculatePace = (FormInput) => {
        const distance_km = parseFloat(document.getElementById("pace-distance1").value)||0;
        let time_hour = parseInt(document.getElementById("pace-time1").value)||0;
        let time_minute = parseInt(document.getElementById("pace-time2").value)||0;
        let time_second = parseInt(document.getElementById("pace-time3").value)||0;

        // 時間の入力フォーム＞秒から分への繰り上げ
        if(time_second >= 60) {
            time_minute = time_minute + Math.floor(time_second/60);
            document.getElementById("pace-time2").value = time_minute;

            time_second = time_second % 60;
            document.getElementById("pace-time3").value = time_second;
        };

        // 時間の入力フォーム＞分から時間への繰り上げ
        if(time_minute >= 60) {
            time_hour = time_hour + Math.floor(time_minute/60);
            document.getElementById("pace-time1").value = time_hour;

            time_minute = time_minute % 60;
            document.getElementById("pace-time2").value = time_minute;
        };

        // 距離の小数点以下は2桁までとする
        if(FormInput.value.indexOf(".") !== -1 && FormInput.value.split(".")[1].length >= 2) {
            nextFocus(FormInput, pace_inputs);
        };

        // ペースを計算し、答えが1秒以上の場合に出力
        const total_time_in_seconds = time_hour*3600 + time_minute*60 + time_second;
        const total_pace_in_seconds = Math.floor(total_time_in_seconds/distance_km);
        const $pace_answer = document.getElementById("pace-answer");
        const $pace_answer_box = document.getElementById("pace-answer-box");

        if (distance_km === 0) {
            $pace_answer_box.classList.add("hidden-answer");
        } else if (0 < total_pace_in_seconds && total_pace_in_seconds < 60) {
            $pace_answer.textContent = total_pace_in_seconds + "秒";
            $pace_answer_box.classList.remove("hidden-answer");
        } else if (60 <= total_pace_in_seconds && total_pace_in_seconds < 3600) {
            $pace_answer.textContent = `${Math.floor(total_pace_in_seconds/60)}分 ${total_pace_in_seconds % 60}秒`;
            $pace_answer_box.classList.remove("hidden-answer");
        } else if (3600 <= total_pace_in_seconds) {
            $pace_answer.textContent = `${Math.floor(total_pace_in_seconds/3600)}時間 ${Math.floor(total_pace_in_seconds/60) % 60}分 ${total_pace_in_seconds % 60}秒`;
            $pace_answer_box.classList.remove("hidden-answer");
        };
    };
    
    // フォーカスを移動させる関数を定義
    const nextFocus = (forEachArg, inputs) => {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i] === forEachArg) {
                (inputs[i + 1] || inputs[0]).focus();
            };
        };
    };

    // 各コピーボタンの挙動を設定
    document.querySelectorAll(".btnCopy").forEach((button) => {
        button.addEventListener("click", () => {
            const copyingtext = button.previousElementSibling.textContent
            navigator.clipboard.writeText(copyingtext);

            button.style.display = "none";
            button.nextElementSibling.style.display = "block";

            setTimeout(() => {
                button.style.display = "block";
                button.nextElementSibling.style.display = "none";
            }, 1600);
        });
    });

    // 各クリアボタンの挙動を設定
    document.querySelectorAll(".btnClear").forEach((button) => {
        const RelatedInputs = button.parentNode.parentNode.querySelectorAll("input");
        const RelatedOutput = button.parentNode.parentNode.querySelector(".output-section");

        button.addEventListener("click", () => {
            for(let i = 0; i < RelatedInputs.length; i++) {
                RelatedInputs[i].value = "";
            };

            RelatedOutput.classList.add("hidden-answer");
            RelatedInputs[0].focus(); //最初の入力フォームにフォーカス移動
        });
    });

    // 各マラソン／ハーフマラソンボタンの挙動を設定
    document.querySelectorAll(".MarathonType").forEach((button) => {
        button.addEventListener("click", (e) => {
            if (e.target.classList.contains("btnMarathon")) {
                const RelatedInput = button.parentNode.querySelectorAll(".distance-input")[0]
                RelatedInput.value = "42.195";
            } else if (e.target.classList.contains("btnHalfMarathon")) {
                const RelatedInput = button.parentNode.querySelectorAll(".distance-input")[0]
                RelatedInput.value = "21.0975";
            };

            // 求めたい項目に対応する関数を呼んで計算処理
            if(e.target.parentNode.parentNode.previousElementSibling.textContent.includes("時間を求める")) {
                calculateTime(document.getElementById("time-distance1"));
            } else if (e.target.parentNode.parentNode.previousElementSibling.textContent.includes("ペースを求める")) {
                calculatePace(document.getElementById("pace-distance1"))
            };
        });
    });
})();