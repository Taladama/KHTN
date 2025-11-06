import { GoogleGenAI } from "@google/genai";
import { Question, UserAnswer } from '../types';

// This function generates the prompt for Gemini based on user's answer
export const generatePrompt = (userAnswerData: UserAnswer): string => {
  const { isCorrect, questionData, answerKey, answerText, correctAnswerText } = userAnswerData;
  
  const userAnswerFullText = `${answerKey.toUpperCase()}. ${answerText}`;
  const correctAnswerFullText = `${questionData.correct.toUpperCase()}. ${correctAnswerText}`;

  if (isCorrect) {
    return `Một học sinh lớp 8 đã trả lời đúng câu hỏi này. Hãy cung cấp thêm một thông tin thú vị hoặc một ứng dụng thực tế liên quan đến khái niệm trong câu hỏi. Giữ câu trả lời ngắn gọn, tập trung, và bằng tiếng Việt.
Câu hỏi: "${questionData.question}"
Đáp án đúng: "${correctAnswerFullText}"
Giải thích gốc: "${questionData.explanation}"`;
  } else {
    return `Một học sinh lớp 8 trả lời sai câu hỏi này. Họ đã chọn đáp án "${userAnswerFullText}" thay vì đáp án đúng là "${correctAnswerFullText}". Hãy giải thích (bằng tiếng Việt) tại sao lựa chọn của họ sai và củng cố lại kiến thức đúng. Tập trung vào hiểu lầm của học sinh khi chọn đáp án sai đó.
Câu hỏi: "${questionData.question}"`;
  }
};


// Main function to call Gemini API
export const fetchExplanation = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    return "Lỗi: Khóa API chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Bạn là một trợ giảng AI thân thiện, chuyên giải thích các khái niệm khoa học lớp 8. Hãy trả lời trực tiếp, súc tích, và bằng tiếng Việt."
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};