
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// 질문 인터페이스 정의
interface Question {
    id: number;
    text: string;
    options: { text: string; value: any }[];
}

// 기본 질문 데이터 (예시)
const defaultQuestions: Question[] = [
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


const App: React.FC = () => {
    const [quizConfig, setQuizConfig] = useState<any>({
        numberOfQuestions: 7,
        useDefaultQuestions: true,
        scoringSystem: '가중치 점수',
        analysisLogic: 'AI 분류 모델 사용',
        detailedAnalysis: true,
        productRecommendation: '상세 정보',
        uiStyle: '컬러풀',
        techStack: 'HTML/JS 기본', // 사용자의 선택 반영
    });
    const [configStep, setConfigStep] = useState<number>(9); // 최종 설정 확인 단계로 이동

    const [tempNumberOfQuestions, setTempNumberOfQuestions] = useState<string>("7");


    const handleNumberOfQuestionsSubmit = (num: number) => {
        setQuizConfig({ ...quizConfig, numberOfQuestions: num });
        setConfigStep(2);
    };

    const handleQuestionSource = (useDefault: boolean) => {
        setQuizConfig({ ...quizConfig, useDefaultQuestions: useDefault });
        setConfigStep(3);
    };

    const handleScoringSystem = (system: string) => {
        setQuizConfig({ ...quizConfig, scoringSystem: system });
        setConfigStep(4);
    };

    const handleAnalysisLogic = (logic: string) => {
        setQuizConfig({ ...quizConfig, analysisLogic: logic });
        setConfigStep(5);
    }

    const handleDetailedAnalysis = (provide: boolean) => {
        setQuizConfig({ ...quizConfig, detailedAnalysis: provide });
        setConfigStep(6);
    }

    const handleProductRecommendation = (style: string | null) => {
        setQuizConfig({ ...quizConfig, productRecommendation: style });
        setConfigStep(7);
    };

    const handleUiStyle = (style: string) => {
        setQuizConfig({ ...quizConfig, uiStyle: style });
        setConfigStep(8);
    };

    const handleTechStack = (stack: string) => {
        setQuizConfig({ ...quizConfig, techStack: stack });
        // 기술 스택 선택 후, 다음 단계로 이동하기 위해 configComplete 호출
        setConfigStep(9);
    };

    const handleConfigComplete = () => {
        setConfigStep(9); // 최종 확인 단계로 이동
    };

    // 설정 단계 1: 질문 수
    if (configStep === 1) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (1/9)</h1>
                <p>안녕하세요! 피부타입 진단 및 분석 웹앱 개발을 도와드릴게요.</p>
                <p>우선, 몇 개의 질문으로 피부타입을 진단하고 싶으신가요? (예: 5, 7, 10)</p>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => { setTempNumberOfQuestions("5"); handleNumberOfQuestionsSubmit(5); }}>5개</button>
                    <button className="button-option" onClick={() => { setTempNumberOfQuestions("7"); handleNumberOfQuestionsSubmit(7); }}>7개</button>
                    <button className="button-option" onClick={() => { setTempNumberOfQuestions("10"); handleNumberOfQuestionsSubmit(10); }}>10개</button>
                </div>
                <p style={{marginTop: "15px"}}>현재 설정된 질문 수: {quizConfig.numberOfQuestions || "미선택"}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 2: 질문 유형
    if (configStep === 2) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (2/9)</h1>
                <p><strong>{quizConfig.numberOfQuestions}개</strong>의 질문으로 진행할게요.</p>
                <p>기본 질문을 사용할까요, 아니면 직접 질문을 입력하시겠어요?</p>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleQuestionSource(true)}>기본 질문 사용</button>
                    <button className="button-option" onClick={() => handleQuestionSource(false)}>직접 입력</button>
                </div>
                 <p style={{marginTop: "15px"}}>선택: {quizConfig.useDefaultQuestions === true ? "기본 질문 사용" : quizConfig.useDefaultQuestions === false ? "직접 입력" : "미선택"}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 3: 점수 체계
    if (configStep === 3) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (3/9)</h1>
                <p>좋아요, {quizConfig.useDefaultQuestions ? "기본 질문을 사용해서" : "질문을 직접 입력하시도록"} 진행할게요.</p>
                <p>이제 <strong>점수 체계</strong>를 정해볼까요?</p>
                <ul style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
                    <li><strong>단순 점수:</strong> 각 답변에 미리 정해진 점수 (예: 1점, 2점, 3점)를 부여합니다.</li>
                    <li><strong>가중치 점수:</strong> 질문의 중요도나 답변의 특성에 따라 다른 가중치를 적용하여 점수를 부여합니다.</li>
                    <li><strong>범위형 점수:</strong> 각 답변이 특정 피부 특성(예: 유분기, 건조함)의 정도를 나타내는 범위를 선택하게 하고, 이를 점수화합니다.</li>
                </ul>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleScoringSystem('단순 점수')}>단순 점수</button>
                    <button className="button-option" onClick={() => handleScoringSystem('가중치 점수')}>가중치 점수</button>
                    <button className="button-option" onClick={() => handleScoringSystem('범위형 점수')}>범위형 점수</button>
                </div>
                <p style={{marginTop: "15px"}}>선택: {quizConfig.scoringSystem || "미선택"}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 4: 피부 타입 분류 로직
    if (configStep === 4) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (4/9)</h1>
                <p>점수 체계로 '<strong>{quizConfig.scoringSystem}</strong>' 방식을 선택하셨네요.</p>
                <p>다음으로, <strong>피부 타입 분류 로직</strong>을 어떻게 할지 결정해 볼까요?</p>
                <ul style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
                    <li><strong>간단 점수 범위 방식:</strong> 각 피부 타입에 해당하는 점수 범위를 미리 설정하고, 사용자의 총점에 따라 타입을 분류합니다.</li>
                    <li><strong>AI 분류 모델 사용:</strong> 사용자의 답변 패턴을 학습한 AI 모델을 사용하여 더 정교하게 피부 타입을 분류합니다. (Gemini API 활용)</li>
                </ul>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleAnalysisLogic('간단 점수 범위')}>간단 점수 범위</button>
                    <button className="button-option" onClick={() => handleAnalysisLogic('AI 분류 모델 사용')}>AI 분류 모델 사용</button>
                </div>
                <p style={{ marginTop: "15px" }}>선택: {quizConfig.analysisLogic || "미선택"}</p>
                <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 5: 세부 피부 특성 및 맞춤 관리 팁
    if (configStep === 5) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (5/9)</h1>
                <p>피부 타입 분류는 '<strong>{quizConfig.analysisLogic}</strong>' 방식으로 진행할게요.</p>
                <p>피부 타입 결과 외에, 사용자의 답변을 분석하여 <strong>세부 피부 특성(예: 유분감, 건조함, 민감도 등)과 맞춤 관리 팁</strong>을 추가로 제공할까요?</p>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button className="button-option" onClick={() => handleDetailedAnalysis(true)}>예</button>
                    <button className="button-option" onClick={() => handleDetailedAnalysis(false)}>아니오</button>
                </div>
                <p style={{ marginTop: "15px" }}>선택: {quizConfig.detailedAnalysis === true ? "예" : quizConfig.detailedAnalysis === false ? "아니오" : "미선택"}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 6: 추천 제품 데이터 제공 방식
    if (configStep === 6) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (6/9)</h1>
                <p>{quizConfig.detailedAnalysis ? "세부 피부 특성 분석과 맞춤 관리 팁을 함께 제공할게요." : "피부 타입 결과만 제공하도록 설정되었어요."}</p>
                <p>이제 <strong>추천 제품을 어떤 방식으로 보여드릴까요?</strong> 다음 중에서 선택해 주세요:</p>
                <ul style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
                    <li><strong>1. 간단 텍스트:</strong> 제품명만 간단하게 텍스트로 추천합니다.</li>
                    <li><strong>2. 링크 포함:</strong> 제품명과 함께 온라인에서 구매할 수 있는 링크를 제공합니다.</li>
                    <li><strong>3. 상세 정보:</strong> 제품 이미지, 주요 설명, 가격대 등 좀 더 자세한 정보를 보여줍니다.</li>
                    <li><strong>4. 필요 없음:</strong> 추천 제품 정보는 제공하지 않습니다.</li>
                </ul>
                <div className="options-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleProductRecommendation('간단 텍스트')}>1. 간단 텍스트</button>
                    <button className="button-option" onClick={() => handleProductRecommendation('링크 포함')}>2. 링크 포함</button>
                    <button className="button-option" onClick={() => handleProductRecommendation('상세 정보')}>3. 상세 정보</button>
                    <button className="button-option" onClick={() => handleProductRecommendation(null)}>4. 필요 없음</button>
                </div>
                <p style={{ marginTop: "15px" }}>선택: {quizConfig.productRecommendation === undefined || quizConfig.productRecommendation === null ? (quizConfig.productRecommendation === null ? "필요 없음" : "미선택") : quizConfig.productRecommendation}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 7: UI 디자인 스타일
    if (configStep === 7) {
        const productRecoText = quizConfig.productRecommendation === null ? "제공 안함" : quizConfig.productRecommendation;
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (7/9)</h1>
                <p>추천 제품은 '<strong>{productRecoText}</strong>' 방식으로 보여드리기로 했어요.</p>
                <p>이제 웹앱의 <strong>UI 디자인 스타일</strong>을 선택해 주세요. 어떤 스타일을 선호하시나요?</p>
                <ul style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
                    <li><strong>심플 (Simple):</strong> 최소한의 요소로 깔끔하고 기능에 집중한 스타일입니다.</li>
                    <li><strong>모던 (Modern):</strong> 현대적이고 세련된 느낌의 디자인입니다.</li>
                    <li><strong>컬러풀 (Colorful):</strong> 다양하고 생동감 있는 색상을 활용하여 밝고 경쾌한 느낌을 줍니다.</li>
                    <li><strong>자연주의 (Natural):</strong> 부드러운 색상과 자연적인 질감을 사용하여 편안함을 주는 스타일입니다.</li>
                </ul>
                <div className="options-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleUiStyle('심플')}>심플 (Simple)</button>
                    <button className="button-option" onClick={() => handleUiStyle('모던')}>모던 (Modern)</button>
                    <button className="button-option" onClick={() => handleUiStyle('컬러풀')}>컬러풀 (Colorful)</button>
                    <button className="button-option" onClick={() => handleUiStyle('자연주의')}>자연주의 (Natural)</button>
                </div>
                <p style={{ marginTop: "15px" }}>선택: {quizConfig.uiStyle || "미선택"}</p>
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 8: 기술 스택
    if (configStep === 8) {
        return (
            <div className="container">
                <h1>피부타입 진단 준비 (8/9)</h1>
                <p>UI 스타일은 '<strong>{quizConfig.uiStyle}</strong>'으로 결정되었어요.</p>
                <p>마지막으로, 이 웹앱을 개발할 때 사용할 <strong>기술 스택</strong>을 선택해주세요.</p>
                <p>이 단계에서는 선택만 받고 실제 코드 생성은 모든 설정 완료 후 진행됩니다.</p>
                 <div className="options-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <button className="button-option" onClick={() => handleTechStack('HTML/JS 기본')}>HTML/JS 기본</button>
                    <button className="button-option" onClick={() => handleTechStack('React')}>React</button>
                    <button className="button-option" onClick={() => handleTechStack('Vue')}>Vue</button>
                </div>
                 <p style={{ marginTop: "15px" }}>선택된 기술 스택: <strong>{quizConfig.techStack}</strong></p>
                 {/* 기술 스택 선택 시 자동으로 다음 단계로 이동하므로, "설정 완료" 버튼은 여기서는 필요 없을 수 있습니다. 
                     만약 명시적인 완료 버튼이 필요하다면 handleTechStack에서 setConfigStep(9)를 호출하지 않고, 
                     아래 버튼의 onClick 핸들러에서 setConfigStep(9)를 호출하도록 수정합니다.
                     현재 로직은 handleTechStack에서 setConfigStep(9)를 호출하여 바로 다음으로 넘어갑니다.
                 */}
                 {/* <button style={{marginTop: '30px'}} className="button-option" onClick={handleConfigComplete}>설정 완료 및 코드 생성 요청</button> */}
                 <p style={{fontSize: '0.9em', color: '#777', marginTop: '10px'}}>선택 후 다음 단계로 자동 이동합니다.</p>
            </div>
        );
    }

    // 설정 단계 9: 최종 설정 확인
    if (configStep === 9) {
        return (
            <div className="container">
                <h1>최종 설정 확인 (9/9)</h1>
                <p>모든 설정이 완료되었습니다. 다음은 선택하신 설정 내역입니다:</p>
                <ul style={{ textAlign: 'left', display: 'inline-block', paddingLeft: '20px', listStyleType: 'disc', marginBottom: '20px' }}>
                    <li><strong>질문 수:</strong> {quizConfig.numberOfQuestions}개</li>
                    <li><strong>질문 유형:</strong> {quizConfig.useDefaultQuestions ? '기본 질문 사용' : '직접 입력'}</li>
                    <li><strong>점수 체계:</strong> {quizConfig.scoringSystem}</li>
                    <li><strong>분석 로직:</strong> {quizConfig.analysisLogic}</li>
                    <li><strong>세부 분석 제공:</strong> {quizConfig.detailedAnalysis ? '예' : '아니오'}</li>
                    <li><strong>추천 제품 방식:</strong> {quizConfig.productRecommendation || '제공 안함'}</li>
                    <li><strong>UI 디자인 스타일:</strong> {quizConfig.uiStyle}</li>
                    <li><strong>기술 스택:</strong> {quizConfig.techStack}</li>
                </ul>
                <p>이 설정으로 최종 피부타입 진단 앱 제작을 진행할까요?</p>
                <div className="options-container" style={{ flexDirection: 'row', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button className="button-option" onClick={() => alert('최종 코드 생성 프로세스를 시작합니다! (구현 예정)')}>네, 진행해주세요!</button>
                    <button className="button-option"
                            onClick={() => {
                                setConfigStep(1); 
                            }}
                            style={{backgroundColor: '#e74c3c'}}>
                        아니오, 처음부터 다시 설정할게요
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <p>설정 단계를 로드 중입니다...</p>
        </div>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
