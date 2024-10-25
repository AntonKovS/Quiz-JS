import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        const that = this;

        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    // console.log(result);
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    document.getElementById('answers-test-name').innerText = result.test.name;
                    document.getElementById('answers-person-name').innerText = userInfo.fullName;
                    document.getElementById('answers-person-email').innerText = Auth.getUserInfo().email;

                    let q = 0;
                    result.test.questions.forEach(item => {
                        const answersOptions = document.getElementById('answers-options');
                        const answersOption = document.createElement('div');
                        answersOption.className = 'answers-option';

                        const answersOptionTitle = document.createElement('div');
                        answersOptionTitle.className = 'answers-option-title';
                        answersOptionTitle.innerHTML = '<span>Вопрос ' + (q + 1)
                            + ':</span> ' + item.question;

                        const answerList = document.createElement('div');
                        answerList.className = 'answer-list';

                        let i = 0;
                        item.answers.forEach(answer => {
                            const answerItem = document.createElement('div');
                            answerItem.className = 'answer-item';
                            answerItem.innerHTML = '<input type="radio">' + answer.answer;
                            answerList.appendChild(answerItem);
                            answersOption.appendChild(answersOptionTitle);
                            answersOption.appendChild(answerList);
                            answersOptions.appendChild(answersOption);

                            if (answer.correct === true) {
                                answerItem.classList.add('answer-right');
                            } else if (answer.correct === false) {
                                answerItem.classList.add('answer-wrong');
                            }
                            i++;
                        });
                        q++;
                    });

                    document.getElementById('back-result').onclick = function () {
                        location.href = '#/result?id=' + that.routeParams.id;
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
                location.href = '#/';
            }
        }
    }
}
