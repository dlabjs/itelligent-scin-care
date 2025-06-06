
import { GoogleGenAI } from "@google/genai";

// 최종 확정된 설정을 기반으로 quizConfig 구성
const quizConfig = {
    numberOfQuestions: 7,
    useDefaultQuestions: true, // 기본 질문 사용으로 고정
    scoringSystem: '가중치 점수', // AI 사용 시 이 값은 프롬프트 구성에 간접적으로만 영향
    analysisLogic: 'AI 분류 모델 사용',
    detailedAnalysis: true,
    productRecommendation: '상세 정보',
    uiStyle: '컬러풀', // CSS에서 반영
    techStack: 'HTML/JS 기본',
};

// 기본 질문 데이터 (7개)
const defaultQuestions = [
    {
        id: 1,
        text: "세안 후 아무것도 바르지 않았을 때 피부가 얼마나 당기나요?",
        options: [
            { text: "전혀 당기지 않는다", value: "oily_1" },
            { text: "조금 당긴다", value: "normal_1" },
            { text: "매우 당긴다", value: "dry_1" },
        ],
    },
    {
        id: 2,
        text: "오후가 되면 T존(이마, 코)에 유분이 얼마나 생기나요?",
        options: [
            { text: "거의 생기지 않는다", value: "dry_2" },
            { text: "조금 생긴다", value: "normal_2" },
            { text: "많이 생긴다 (번들거린다)", value: "oily_2" },
        ],
    },
    {
        id: 3,
        text: "피부에 붉은 기가 잘 생기거나 가려움을 자주 느끼나요?",
        options: [
            { text: "거의 그렇지 않다", value: "normal_3" },
            { text: "가끔 그렇다", value: "sensitive_1" },
            { text: "자주 그렇다", value: "sensitive_2" },
        ],
    },
    {
        id: 4,
        text: "피부 트러블(여드름, 뾰루지)이 얼마나 자주 생기나요?",
        options: [
            { text: "거의 생기지 않는다", value: "normal_4" },
            { text: "가끔 생긴다", value: "oily_3" },
            { text: "자주 생긴다", value: "oily_4" },
        ],
    },
    {
        id: 5,
        text: "각질이 눈에 띄게 일어나거나 화장이 잘 뜨는 편인가요?",
        options: [
            { text: "거의 그렇지 않다", value: "normal_5" },
            { text: "가끔 그렇다", value: "dry_3" },
            { text: "자주 그렇다", value: "dry_4" },
        ],
    },
    {
        id: 6,
        text: "모공의 크기는 어떤 편인가요?",
        options: [
            { text: "작고 눈에 잘 띄지 않는다", value: "dry_5" },
            { text: "T존 부위는 넓고, U존은 괜찮다", value: "combination_1" },
            { text: "전체적으로 넓고 눈에 잘 띈다", value: "oily_5" },
        ],
    },
    {
        id: 7,
        text: "새로운 화장품을 사용했을 때 피부가 민감하게 반응하는 편인가요?",
        options: [
            { text: "거의 그렇지 않다", value: "normal_6" },
            { text: "가끔 그렇다", value: "sensitive_3" },
            { text: "자주 그렇다 (따갑거나, 붉어지거나, 트러블 발생)", value: "sensitive_4" },
        ],
    }
];

let currentQuestionIndex = 0;
let userAnswers = []; // { questionId, questionText, answerValue, answerText }
let questionsToAsk = [];

const progressBar = document.getElementById('progress-bar');
const questionArea = document.getElementById('question-area');
const nextBtn = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz-container');
const loadingContainer = document.getElementById('loading-container');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const restartBtn = document.getElementById('restart-btn');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const errorRestartBtn = document.getElementById('error-restart-btn');

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    displayError("API 키가 설정되지 않았습니다. 애플리케이션 설정을 확인해주세요.");
}
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

document.addEventListener('DOMContentLoaded', () => {
    startQuiz();
    nextBtn.addEventListener('click', handleNextQuestion);
    restartBtn.addEventListener('click', startQuiz);
    errorRestartBtn.addEventListener('click', startQuiz);
});

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    questionsToAsk = defaultQuestions.slice(0, quizConfig.numberOfQuestions);

    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    updateProgressBar();
    displayQuestion();
    nextBtn.disabled = true;
}

function displayQuestion() {
    if (currentQuestionIndex >= questionsToAsk.length) {
        finishQuiz();
        return;
    }

    const question = questionsToAsk[currentQuestionIndex];
    questionArea.innerHTML = `
        <h2>Q${currentQuestionIndex + 1}. ${question.text}</h2>
        <div class="options">
            ${question.options.map(option => `
                <button data-value="${option.value}" data-text="${option.text}">${option.text}</button>
            `).join('')}
        </div>
    `;

    document.querySelectorAll('#question-area .options button').forEach(button => {
        button.addEventListener('click', (e) => {
            // 이전 선택 해제
            document.querySelectorAll('#question-area .options button.selected').forEach(sel => sel.classList.remove('selected'));
            // 현재 선택 추가
            e.target.classList.add('selected');
            nextBtn.disabled = false;
        });
    });
    updateProgressBar();
}

function handleNextQuestion() {
    const selectedOption = document.querySelector('#question-area .options button.selected');
    if (!selectedOption) return; // 선택된 답변이 없으면 진행 안 함

    const question = questionsToAsk[currentQuestionIndex];
    userAnswers.push({
        questionId: question.id,
        questionText: question.text,
        answerValue: selectedOption.dataset.value,
        answerText: selectedOption.dataset.text
    });

    currentQuestionIndex++;
    nextBtn.disabled = true; // 다음 질문으로 넘어가면 다시 비활성화
    displayQuestion();
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questionsToAsk.length) * 100;
    progressBar.style.width = `${progress}%`;
}

async function finishQuiz() {
    quizContainer.classList.add('hidden');
    loadingContainer.classList.remove('hidden');
    updateProgressBar(); // 최종 100%

    try {
        if (!ai) {
            throw new Error("AI 클라이언트가 초기화되지 않았습니다. API 키를 확인해주세요.");
        }

        const analysisPrompt = constructAnalysisPrompt(userAnswers);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17", // 최신 권장 모델
            contents: [{ parts: [{ text: analysisPrompt }] }],
            config: {
                responseMimeType: "application/json",
                 // thinkingConfig: { thinkingBudget: 0 } // 저지연 필요시 (옵션)
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const resultData = JSON.parse(jsonStr);
        displayResults(resultData);

    } catch (error) {
        console.error("Error during AI analysis:", error);
        let userFriendlyMessage = "피부 타입 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        if (error.message.includes("API key not valid")) {
            userFriendlyMessage = "API 키가 유효하지 않습니다. 관리자에게 문의하세요.";
        } else if (error.message.includes("Quota exceeded")) {
            userFriendlyMessage = "API 사용량이 초과되었습니다. 나중에 다시 시도해주세요.";
        }
        displayError(userFriendlyMessage);
    } finally {
        loadingContainer.classList.add('hidden');
    }
}

function constructAnalysisPrompt(answers) {
    let prompt = `당신은 전문 피부 분석가입니다. 다음 사용자의 질문과 답변을 바탕으로 피부 타입을 진단하고, 세부 특성, 맞춤 관리 팁, 그리고 추천 제품 정보를 제공해주세요. 결과는 반드시 다음 JSON 형식으로 반환해주세요:
{
  "skinType": "예: 지성, 건성, 복합성, 중성, 민감성 중 하나",
  "summary": "피부 타입에 대한 간략한 한 줄 요약",
  "characteristics": [
    "세부 피부 특성 1",
    "세부 피부 특성 2",
    "기타 등등"
  ],
  "careTips": [
    "맞춤 관리 팁 1 (구체적으로)",
    "맞춤 관리 팁 2 (실천 가능하게)",
    "기타 등등"
  ],
  "recommendedProducts": [
    {
      "name": "추천 제품명 1",
      "category": "예: 토너, 세럼, 크림, 클렌저 등",
      "description": "제품에 대한 간략한 설명 (2-3문장)",
      "keyIngredients": ["주요 성분 1", "주요 성분 2"],
      "priceRange": "예: ₩20,000 ~ ₩30,000 또는 '₩15,000대'",
      "usageTip": "간단한 사용 팁 (선택 사항)"
    }
  ]
}

사용자의 답변:
`;
    answers.forEach(ans => {
        prompt += `- 질문: ${ans.questionText}\n  - 답변: ${ans.answerText}\n`;
    });

    if (!quizConfig.detailedAnalysis) {
        prompt += "\n참고: 세부 특성 분석과 맞춤 관리 팁은 생략하고 피부 타입만 알려주세요.";
        // JSON 구조에서 characteristics와 careTips를 제외하도록 요청을 수정해야 하지만,
        // 일단은 생성 후 클라이언트에서 필터링하거나, 프롬프트로만 요청.
        // 이 예제에서는 JSON 구조는 유지하고 내용이 비도록 유도.
    }
    if (quizConfig.productRecommendation === '필요 없음') {
        prompt += "\n참고: 추천 제품 정보는 제공하지 마세요.";
         // JSON 구조에서 recommendedProducts를 제외하거나 빈 배열로 유도.
    } else if (quizConfig.productRecommendation === '간단 텍스트') {
         prompt += "\n참고: 추천 제품은 이름만 간단히 텍스트로 제공해주세요. recommendedProducts 배열에 { \"name\": \"제품명\" } 형식으로 넣어주세요.";
    } else if (quizConfig.productRecommendation === '링크 포함') {
        prompt += "\n참고: 추천 제품은 이름과 함께 구매 링크 예시(실제 링크 아니어도 됨)를 포함하여 제공해주세요. recommendedProducts 배열에 { \"name\": \"제품명\", \"link\": \"https://example.com/product-link\" } 형식으로 넣어주세요.";
    }
    // '상세 정보'는 기본 프롬프트 JSON 구조에 따름.

    return prompt;
}

function displayResults(data) {
    resultContainer.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');

    let html = `<h3>🌟 당신의 피부 타입: ${data.skinType || '분석 정보 없음'}</h3>`;
    if (data.summary) {
        html += `<p><strong>한 줄 요약:</strong> ${data.summary}</p>`;
    }

    if (quizConfig.detailedAnalysis && data.characteristics && data.characteristics.length > 0) {
        html += `<h3>✨ 세부 피부 특성</h3><ul>`;
        data.characteristics.forEach(char => html += `<li>${char}</li>`);
        html += `</ul>`;
    }

    if (quizConfig.detailedAnalysis && data.careTips && data.careTips.length > 0) {
        html += `<h3>💡 맞춤 관리 팁</h3><ul>`;
        data.careTips.forEach(tip => html += `<li>${tip}</li>`);
        html += `</ul>`;
    }

    if (quizConfig.productRecommendation !== '필요 없음' && data.recommendedProducts && data.recommendedProducts.length > 0) {
        html += `<h3>🎁 추천 제품 정보</h3>`;
        data.recommendedProducts.forEach(product => {
            html += `<div class="product-card">`;
            // 상세 정보 스타일
            if (quizConfig.productRecommendation === '상세 정보') {
                html += `<img src="https://via.placeholder.com/100?text=${encodeURIComponent(product.category || '제품')}" alt="${product.name || '추천 제품'}">`; // Placeholder 이미지
                html += `<h4>${product.name || '제품명 없음'}</h4>`;
                if(product.category) html += `<p><strong>카테고리:</strong> ${product.category}</p>`;
                if(product.description) html += `<p>${product.description}</p>`;
                if(product.keyIngredients && product.keyIngredients.length > 0) html += `<p><strong>주요 성분:</strong> ${product.keyIngredients.join(', ')}</p>`;
                if(product.priceRange) html += `<p><strong>가격대:</strong> ${product.priceRange}</p>`;
                if(product.usageTip) html += `<p><strong>사용 팁:</strong> ${product.usageTip}</p>`;
            } 
            // 링크 포함 스타일
            else if (quizConfig.productRecommendation === '링크 포함') {
                html += `<h4>${product.name || '제품명 없음'}</h4>`;
                if (product.link) html += `<p><a href="${product.link}" target="_blank" rel="noopener noreferrer">제품 보러가기 (예시 링크)</a></p>`;
                else html += `<p>구매 링크 정보 없음</p>`
            } 
            // 간단 텍스트 스타일
            else if (quizConfig.productRecommendation === '간단 텍스트') {
                 html += `<h4>${product.name || '제품명 없음'}</h4>`;
            }
            html += `</div>`;
        });
    } else if (quizConfig.productRecommendation !== '필요 없음') {
        html += `<p>추천 드릴 만한 제품 정보를 현재 가져올 수 없습니다.</p>`
    }


    resultContent.innerHTML = html;
}

function displayError(message) {
    quizContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorMessage.textContent = message;
}

