
import { Question } from './types';

export const QUIZ_HISTORY_STORAGE_KEY = 'quizHistory';
export const MAX_HISTORY_ATTEMPTS = 50;

export const NUM_QUESTIONS_PER_QUIZ = 15;

export const allQuestions: Question[] = [
    {
        question: "Dụng cụ nào sau đây hoạt động dựa trên nguyên lý đòn bẩy loại 1 (điểm tựa ở giữa, lực tác dụng và vật cản ở hai bên)?",
        a: "Cái kéo",
        b: "Xe rùa (xe cút kít)",
        c: "Cái kẹp gắp đá",
        d: "Đôi đũa",
        correct: "a",
        explanation: "Cái kéo có điểm tựa (ốc vít) ở giữa hai lưỡi (vật cản) và tay cầm (lực) -> Loại 1. Xe rùa là Loại 2 (lợi về lực). Kẹp gắp và đũa là Loại 2 (không lợi về lực)."
    },
    {
        question: "Khi đun nóng một chất lỏng trong ống nghiệm, thao tác nào sau đây là đúng và an toàn?",
        a: "Kẹp ống nghiệm ở 1/2 ống, hơ thẳng đứng và tập trung ngọn lửa vào đáy ống.",
        b: "Kẹp ống nghiệm ở 1/3 từ miệng ống, hơ nghiêng, lúc đầu hơ đều ống rồi mới tập trung vào đáy, miệng ống hướng về phía không có người.",
        c: "Kẹp ống nghiệm ở đáy ống, hơ nghiêng và hướng miệng ống vào mặt mình để quan sát.",
        d: "Đổ chất lỏng đầy 100% ống nghiệm và đun thật mạnh để tiết kiệm thời gian.",
        correct: "b",
        explanation: "Đây là quy tắc an toàn chuẩn: kẹp 1/3 từ miệng, hơ đều, hơ nghiêng, hướng ra xa."
    },
    {
        question: "Khẳng định 'Khối lượng mol (M) của nước (H₂O) là 18 g/mol' có nghĩa là gì?",
        a: "1 phân tử H₂O bất kỳ nặng 18 gam.",
        b: "1 gam H₂O chứa 18 mol phân tử.",
        c: "1 lít H₂O nặng 18 gam.",
        d: "6,022 x 10²³ phân tử H₂O (tức 1 mol) thì nặng 18 gam.",
        correct: "d",
        explanation: "Đây là định nghĩa chính xác của khối lượng mol (khối lượng của N_A hạt)."
    },
    {
        question: "Khi nói 'dung dịch đường đã bão hòa' ở 25°C, điều đó có nghĩa là:",
        a: "Dung dịch này rất ngọt.",
        b: "Ở 25°C, dung dịch này không thể hòa tan thêm bất kỳ chất nào khác.",
        c: "Ở 25°C, dung dịch này không thể hòa tan thêm đường nữa.",
        d: "Dung dịch đã được đun nóng đến 100°C rồi để nguội.",
        correct: "c",
        explanation: "Bão hòa là trạng thái không thể hòa tan thêm *chính chất tan đó* ở nhiệt độ xác định."
    },
    {
        question: "Tính tỉ khối của khí sulfur dioxide (SO₂) so với không khí và kết luận.",
        a: "d ≈ 2,21; khí SO₂ nặng hơn không khí.",
        b: "d ≈ 0,45; khí SO₂ nhẹ hơn không khí.",
        c: "d ≈ 1,65; khí SO₂ nặng hơn không khí.",
        d: "d ≈ 1,10; khí SO₂ nặng hơn không khí.",
        correct: "a",
        explanation: "Bước 1: M(S)=32, M(O)=16 => M(SO₂) = 32 + 2 * 16 = 64 g/mol. Bước 2: M(không khí) ≈ 29 g/mol. Bước 3: d = M(SO₂) / M(kk) = 64 / 29 ≈ 2,21. Vì d > 1 nên nặng hơn."
    },
    {
        question: "Hòa tan 25 gam muối ăn (NaCl) vào 225 gam nước. Nồng độ phần trăm (C%) của dung dịch thu được là bao nhiêu?",
        a: "11,11%",
        b: "10,00%",
        c: "25,00%",
        d: "9,00%",
        correct: "b",
        explanation: "Bước 1: m(ct) = 25 g; m(dm) = 225 g. Bước 2: m(dd) = m(ct) + m(dm) = 25 + 225 = 250 g. Bước 3: C% = (m(ct) / m(dd)) * 100% = (25 / 250) * 100% = 10%."
    },
    {
        question: "Cần hòa tan bao nhiêu gam đường (C₁₂H₂₂O₁₁) vào nước để thu được 200 gam dung dịch nước đường 15%?",
        a: "15 gam",
        b: "30 gam",
        c: "170 gam",
        d: "200 gam",
        correct: "b",
        explanation: "Bước 1: Xác định m(dd) = 200 g; C% = 15%. Bước 2: Áp dụng công thức m(ct) = (C% * m(dd)) / 100% = (15 * 200) / 100 = 30 g."
    },
    {
        question: "Hòa tan 0,2 mol C₁₂H₂₂O₁₁ (đường) vào nước thu được 400 mL dung dịch. Tính nồng độ mol (Cᴍ) của dung dịch.",
        a: "0,5 M",
        b: "0,2 M",
        c: "2 M",
        d: "0,0005 M",
        correct: "a",
        explanation: "Bước 1: n = 0,2 mol. Bước 2: Đổi V = 400 mL = 0,4 L. Bước 3: Cᴍ = n / V = 0,2 / 0,4 = 0,5 M."
    },
    {
        question: "Hòa tan 8 gam sodium hydroxide (NaOH) vào nước thu được 0,5 lít dung dịch. Nồng độ mol (Cᴍ) của dung dịch này là:",
        a: "0,4 M",
        b: "0,2 M",
        c: "0,5 M",
        d: "16 M",
        correct: "a",
        explanation: "Bước 1: M(Na)=23, M(O)=16, M(H)=1 => M(NaOH) = 23 + 16 + 1 = 40 g/mol. Bước 2: n(NaOH) = m / M = 8 / 40 = 0,2 mol. Bước 3: V = 0,5 L. Bước 4: Cᴍ = n / V = 0,2 / 0,5 = 0,4 M."
    },
    {
        question: "Tính thể tích (ở điều kiện chuẩn 25°C, 1 bar) của 11 gam khí propane (C₃H₈)?",
        a: "24,79 L",
        b: "4,958 L",
        c: "6,1975 L",
        d: "12,395 L",
        correct: "c",
        explanation: "Bước 1: M(C)=12, M(H)=1 => M(C₃H₈) = 3 * 12 + 8 * 1 = 44 g/mol. Bước 2: n(C₃H₈) = m / M = 11 / 44 = 0,25 mol. Bước 3: V = n * 24,79 = 0,25 * 24,79 = 6,1975 L."
    },
    {
        question: "Trong các thiết bị sau: pin, ampe kế, công tắc, bóng đèn. Đâu là thiết bị điều khiển (đóng/ngắt) mạch điện?",
        a: "Pin",
        b: "Ampe kế",
        c: "Công tắc",
        d: "Bóng đèn",
        correct: "c",
        explanation: "Công tắc dùng để đóng hoặc ngắt (mở) mạch điện, cho phép hoặc không cho phép dòng điện chạy qua."
    },
    {
        question: "Cái bập bênh là ví dụ về đòn bẩy loại mấy?",
        a: "Loại 1 (Điểm tựa ở giữa)",
        b: "Loại 2 (Vật cản ở giữa)",
        c: "Loại 3 (Lực tác dụng ở giữa)",
        d: "Không phải đòn bẩy",
        correct: "a",
        explanation: "Bập bênh có điểm tựa ở chính giữa, lực tác dụng và vật cản (hai người) ở hai đầu."
    },
    {
        question: "Khí Nitrogen (N₂) nhẹ hơn khí nào sau đây?",
        a: "Oxygen (O₂)",
        b: "Helium (He)",
        c: "Ammonia (NH₃)",
        d: "Hydrogen (H₂)",
        correct: "a",
        explanation: "M(N₂) = 28. Chỉ có M(O₂) = 32 là lớn hơn 28. Các khí còn lại đều nhẹ hơn N₂."
    },
    {
        question: "Hiện tượng nào sau đây là một biến đổi vật lý?",
        a: "Nến cháy",
        b: "Sắt bị gỉ sét",
        c: "Cơm bị thiu",
        d: "Nước đá tan chảy",
        correct: "d",
        explanation: "Nước đá tan (từ rắn sang lỏng) chỉ là thay đổi trạng thái, vẫn là H₂O, không tạo chất mới. Các hiện tượng còn lại đều tạo chất mới."
    },
    {
        question: "Công thức tính khối lượng riêng (D) của một chất là gì? (với m: khối lượng, V: thể tích)",
        a: "D = m * V",
        b: "D = m / V",
        c: "D = V / m",
        d: "D = m + V",
        correct: "b",
        explanation: "Khối lượng riêng là khối lượng của một đơn vị thể tích (m/V)."
    },
    {
        question: "Độ tan (S) của một chất là số gam chất đó tan trong...",
        a: "100 gam dung dịch",
        b: "100 gam dung môi (thường là nước) để tạo dung dịch bão hòa",
        c: "1 lít dung dịch",
        d: "1 lít dung môi",
        correct: "b",
        explanation: "Định nghĩa: Độ tan (S) là số gam chất tan có thể tan trong 100g dung môi để tạo thành dung dịch bão hòa ở nhiệt độ xác định."
    },
    {
        question: "Cần bao nhiêu gam muối ăn (NaCl) để pha 200ml dung dịch 0.5M?",
        a: "5.85 gam",
        b: "11.7 gam",
        c: "0.585 gam",
        d: "2.925 gam",
        correct: "a",
        explanation: "Bước 1: V = 200ml = 0.2L. Bước 2: n = Cᴍ * V = 0.5 * 0.2 = 0.1 mol. Bước 3: M(NaCl) = 23 + 35.5 = 58.5 g/mol. Bước 4: m = n * M = 0.1 * 58.5 = 5.85 gam."
    },
    {
        question: "Phản ứng tỏa nhiệt là phản ứng...",
        a: "Làm nhiệt độ môi trường xung quanh giảm xuống.",
        b: "Giải phóng năng lượng dưới dạng nhiệt.",
        c: "Cần cung cấp năng lượng liên tục trong suốt quá trình.",
        d: "Chỉ xảy ra khi có ánh sáng.",
        correct: "b",
        explanation: "Phản ứng tỏa nhiệt (exothermic) giải phóng nhiệt, làm môi trường xung quanh nóng lên."
    },
    {
        question: "Phản ứng thu nhiệt là phản ứng...",
        a: "Làm nhiệt độ môi trường xung quanh tăng lên.",
        b: "Giải phóng năng lượng dưới dạng nhiệt.",
        c: "Hấp thụ năng lượng (nhiệt) từ môi trường.",
        d: "Tự động xảy ra không cần năng lượng.",
        correct: "c",
        explanation: "Phản ứng thu nhiệt (endothermic) hấp thụ nhiệt từ môi trường, làm môi trường xung quanh lạnh đi."
    },
    {
        question: "Đơn vị của Nồng độ mol (Cᴍ) là gì?",
        a: "g/mol",
        b: "L (lít)",
        c: "mol/L (hoặc M)",
        d: "% (phần trăm)",
        correct: "c",
        explanation: "Nồng độ mol (Cᴍ) được định nghĩa là số mol chất tan có trong 1 lít dung dịch, do đó đơn vị là mol/L, thường được viết tắt là M."
    },
    {
        question: "Đơn vị của Khối lượng mol (M) là gì?",
        a: "g (gam)",
        b: "mol",
        c: "g/mol",
        d: "g/L",
        correct: "c",
        explanation: "Khối lượng mol (M) là khối lượng (tính bằng gam) của 1 mol chất đó. Đơn vị là gam trên mol (g/mol)."
    },
    {
        question: "Đơn vị của Khối lượng riêng (D) thường dùng là gì?",
        a: "kg/m³ hoặc g/mL",
        b: "kg",
        c: "m³",
        d: "N (Newton)",
        correct: "a",
        explanation: "Khối lượng riêng (D) là khối lượng của một đơn vị thể tích (D = m/V). Đơn vị chuẩn là kg/m³, nhưng trong hóa học thường dùng g/mL (cho chất lỏng) hoặc g/cm³ (cho chất rắn)."
    },
    {
        question: "Nồng độ phần trăm (C%) là đại lượng...",
        a: "Không có đơn vị",
        b: "Có đơn vị là %",
        c: "Có đơn vị là gam",
        d: "Có đơn vị là mol",
        correct: "b",
        explanation: "Nồng độ phần trăm (C%) là tỉ lệ phần trăm khối lượng chất tan so với khối lượng dung dịch. Ký hiệu % chính là đơn vị của nó."
    },
    {
        question: "Dụng cụ nào thường dùng để lấy một lượng hóa chất rắn, dạng bột ra khỏi lọ chứa?",
        a: "Ống hút nhỏ giọt",
        b: "Thìa (muỗng) thủy tinh hoặc sứ",
        c: "Ống đong",
        d: "Bình tam giác",
        correct: "b",
        explanation: "Thìa (muỗng) thủy tinh hoặc sứ (hoặc kim loại) là dụng cụ chuyên dụng để xúc hóa chất rắn, dạng bột."
    },
    {
        question: "Dụng cụ nào thường dùng để lấy một lượng nhỏ hóa chất lỏng ra khỏi lọ chứa?",
        a: "Ống hút nhỏ giọt (pipet)",
        b: "Thìa (muỗng) sứ",
        c: "Giấy lọc",
        d: "Đũa thủy tinh",
        correct: "a",
        explanation: "Ống hút nhỏ giọt (pipet) được dùng để lấy một lượng nhỏ hóa chất lỏng và chuyển sang ống nghiệm hoặc dụng cụ khác."
    },
    {
        question: "Trong các thiết bị: Pin, Ampe kế, Công tắc, Dây nối. Đâu là thiết bị đo lường điện?",
        a: "Pin",
        b: "Ampe kế",
        c: "Công tắc",
        d: "Dây nối",
        correct: "b",
        explanation: "Ampe kế là thiết bị dùng để đo cường độ dòng điện. Pin là nguồn điện. Công tắc là thiết bị điều khiển. Dây nối là thiết bị kết nối."
    },
    {
        question: "Cho các thiết bị: Pin 1.5V, Cầu chì, Bóng đèn, Vôn kế. Đâu là thiết bị sử dụng (tiêu thụ) điện?",
        a: "Pin 1.5V",
        b: "Cầu chì",
        c: "Bóng đèn",
        d: "Vôn kế",
        correct: "c",
        explanation: "Bóng đèn tiêu thụ điện năng để chuyển hóa thành quang năng (ánh sáng). Pin là nguồn điện. Cầu chì là thiết bị bảo vệ. Vôn kế là thiết bị đo."
    },
    {
        question: "Cái mở nắp chai (loại tì vào nắp chai) là ví dụ về đòn bẩy loại mấy?",
        a: "Loại 1 (Điểm tựa ở giữa)",
        b: "Loại 2 (cho lợi về lực)",
        c: "Loại 2 (không cho lợi về lực)",
        d: "Không phải đòn bẩy",
        correct: "b",
        explanation: "Khi mở nắp chai, điểm tựa (O) ở một đầu, lực (F) ở đầu kia, vật cản (R) ở giữa. Vì R gần O hơn F, đây là trường hợp cho lợi về lực (Loại 2)."
    },
    {
        question: "Đôi đũa khi gắp thức ăn (theo phân loại SGK) được xếp vào loại nào?",
        a: "Loại 1 (Điểm tựa ở giữa)",
        b: "Loại 2 (cho lợi về lực)",
        c: "Loại 2 (không cho lợi về lực)",
        d: "Không phải đòn bẩy",
        correct: "c",
        explanation: "Khi dùng đũa, điểm tựa (O) ở khớp ngón tay, vật cản (R) là thức ăn ở đầu đũa, lực (F) là ngón tay tác dụng ở giữa. Vì F gần O hơn R, đây là trường hợp không cho lợi về lực (Loại 2)."
    },
    {
        question: "Cho phương trình: ...P + ...O₂ → ...P₂O₅. Các hệ số (số nguyên, tối giản) lần lượt điền vào là:",
        a: "2, 5, 2",
        b: "4, 5, 2",
        c: "2, 3, 2",
        d: "4, 3, 2",
        correct: "b",
        explanation: "Cân bằng: 4P + 5O₂ → 2P₂O₅. (Bắt đầu bằng P₂O₅: 2P₂O₅ -> 4P. O có 10, vậy 5O₂)."
    },
    {
        question: "Cho phương trình: Fe + ...O₂ → Fe₃O₄. Hệ số (số nguyên, tối giản) của Fe và O₂ lần lượt là:",
        a: "3 và 2",
        b: "2 và 1",
        c: "3 và 4",
        d: "1 và 2",
        correct: "a",
        explanation: "Cân bằng: 3Fe + 2O₂ → Fe₃O₄."
    },
    {
        question: "Quá trình nào sau đây KHÔNG phải là biến đổi vật lý?",
        a: "Hòa tan muối ăn vào nước.",
        b: "Nước bay hơi tạo thành mây.",
        c: "Uốn một thanh sắt thành vòng tròn.",
        d: "Đốt cháy một mẩu giấy.",
        correct: "d",
        explanation: "Đốt cháy giấy là biến đổi hóa học (tạo ra tro, CO₂, hơi nước). Ba quá trình còn lại chỉ thay đổi trạng thái hoặc hình dạng, không tạo chất mới."
    },
    {
        question: "Quá trình nào sau đây KHÔNG phải là biến đổi hóa học?",
        a: "Sữa để lâu bị chua.",
        b: "Sắt bị gỉ sét trong không khí ẩm.",
        c: "Thủy tinh bị nóng chảy khi nung.",
        d: "Trứng bị thối.",
        correct: "c",
        explanation: "Thủy tinh nóng chảy chỉ là sự thay đổi trạng thái (vật lý). Ba quá trình còn lại đều có sự tạo thành chất mới."
    },
    {
        question: "Phản ứng nào sau đây là một ví dụ về phản ứng THU NHIỆT?",
        a: "Nến cháy (đốt parafin).",
        b: "Hòa tan vôi sống (CaO) vào nước.",
        c: "Phản ứng nung đá vôi (CaCO₃) thành vôi sống (CaO).",
        d: "Phản ứng hô hấp của tế bào.",
        correct: "c",
        explanation: "Nung đá vôi là quá trình cần cung cấp nhiệt lượng rất lớn và liên tục. Các phản ứng còn lại đều là phản ứng tỏa nhiệt."
    },
    {
        question: "Dụng cụ nào sau đây KHÔNG phải là ví dụ về đòn bẩy loại 1 (điểm tựa ở giữa)?",
        a: "Cái kéo",
        b: "Cái xe rùa (xe cút kít)",
        c: "Cái bập bênh",
        d: "Cái cân Rô-béc-van",
        correct: "b",
        explanation: "Cái xe rùa là đòn bẩy loại 2 (vật cản ở giữa). Kéo, bập bênh, cân Rô-béc-van đều có điểm tựa ở giữa."
    },
    {
        question: "Nếu không may hóa chất bắn vào mắt, thao tác xử lý đầu tiên và quan trọng nhất là gì?",
        a: "Báo ngay cho giáo viên và chờ xử lý.",
        b: "Dùng tay dụi mắt ngay lập tức.",
        c: "Rửa mắt liên tục bằng nước sạch trong ít nhất 15 phút.",
        d: "Tìm ngay lọ thuốc nhỏ mắt để nhỏ vào.",
        correct: "c",
        explanation: "Ưu tiên hàng đầu là phải rửa sạch hóa chất ra khỏi mắt ngay lập tức bằng cách xối nước sạch liên tục."
    },
    {
        question: "Để lấy chính xác 20mL dung dịch từ lọ này sang lọ khác, dụng cụ nào cho độ chính xác cao nhất?",
        a: "Cốc thủy tinh 50mL",
        b: "Ống đong 25mL",
        c: "Pipet bầu 20mL (hoặc Buret)",
        d: "Bình tam giác 100mL",
        correct: "c",
        explanation: "Pipet (đặc biệt là pipet bầu) và Buret là dụng cụ đo lường thể tích chất lỏng có độ chính xác cao nhất. Ống đong có độ chính xác tương đối. Cốc và bình tam giác dùng để chứa đựng."
    },
    {
        question: "Đơn vị 'mol' dùng để đo đại lượng nào?",
        a: "Khối lượng của chất.",
        b: "Thể tích của chất.",
        c: "Lượng chất (số lượng hạt vi mô).",
        d: "Nồng độ của dung dịch.",
        correct: "c",
        explanation: "Mol là đơn vị đo lượng chất, biểu thị một lượng chứa N.A (6,022 x 10²³) hạt (nguyên tử, phân tử, ion...)."
    },
    {
        question: "Hòa tan 50 gam đường vào 50 gam nước. Nồng độ phần trăm (C%) của dung dịch thu được là bao nhiêu?",
        a: "100%",
        b: "50%",
        c: "25%",
        d: "Không xác định được",
        correct: "b",
        explanation: "m(ct) = 50g; m(dm) = 50g. m(dd) = m(ct) + m(dm) = 50 + 50 = 100g. C% = (m(ct) / m(dd)) * 100% = (50 / 100) * 100% = 50%."
    },
    {
        question: "Một khí X có tỉ khối so với khí Hydrogen (H₂) là 17. Khối lượng mol (M) của khí X là bao nhiêu?",
        a: "17 g/mol",
        b: "34 g/mol",
        c: "8.5 g/mol",
        d: "19 g/mol",
        correct: "b",
        explanation: "Ta có: d(X/H₂) = M(X) / M(H₂). M(H₂) = 2 g/mol. Suy ra: M(X) = d(X/H₂) * M(H₂) = 17 * 2 = 34 g/mol (Đây là khí H₂S)."
    },
    {
        question: "Một khí Y được xác định là nhẹ hơn không khí (M(kk) ≈ 29). Khí Y KHÔNG THỂ là khí nào sau đây?",
        a: "Methane (CH₄)",
        b: "Ammonia (NH₃)",
        c: "Carbon dioxide (CO₂)",
        d: "Helium (He)",
        correct: "c",
        explanation: "M(CH₄)=16, M(NH₃)=17, M(He)=4. Ba khí này đều < 29 (nhẹ hơn không khí). M(CO₂) = 44 > 29 (nặng hơn không khí). Vậy khí Y không thể là CO₂."
    },
    {
        question: "Cho phương trình: ...Al + ...H₂SO₄ → ...Al₂(SO₄)₃ + ...H₂. Các hệ số (số nguyên, tối giản) lần lượt là:",
        a: "2, 3, 1, 3",
        b: "1, 3, 1, 3",
        c: "2, 6, 1, 3",
        d: "2, 3, 2, 3",
        correct: "a",
        explanation: "Cân bằng nhóm (SO₄) trước: 1 Al₂(SO₄)₃ -> 3 H₂SO₄. -> 2 Al. -> 3 H₂. Phương trình: 2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂."
    },
    {
        question: "Cho phương trình: ...Fe(OH)₃ ---t°---> ...Fe₂O₃ + ...H₂O. Các hệ số (số nguyên, tối giản) lần lượt là:",
        a: "1, 1, 3",
        b: "2, 1, 3",
        c: "2, 2, 3",
        d: "2, 1, 1",
        correct: "b",
        explanation: "Cân bằng Fe trước: 1 Fe₂O₃ -> 2 Fe(OH)₃. Đếm H: 2 * 3 = 6H. Vậy cần 3 H₂O. Phương trình: 2Fe(OH)₃ → Fe₂O₃ + 3H₂O."
    },
    {
        question: "Dụng cụ nào sau đây KHÔNG hoạt động dựa trên nguyên lý đòn bẩy?",
        a: "Cái búa dùng để nhổ đinh.",
        b: "Một mặt phẳng nghiêng.",
        c: "Cái kìm.",
        d: "Cái xe rùa.",
        correct: "b",
        explanation: "Mặt phẳng nghiêng là một loại máy cơ đơn giản khác, giúp giảm lực kéo/đẩy vật lên cao. Búa (Loại 1), Kìm (Loại 1), Xe rùa (Loại 2) đều là đòn bẩy."
    },
    {
        question: "Chức năng chính của Cầu chì trong một mạch điện là gì?",
        a: "Tăng hiệu điện thế cho mạch.",
        b: "Ổn định dòng điện.",
        c: "Đo cường độ dòng điện.",
        d: "Bảo vệ mạch, tự ngắt khi dòng điện quá tải (chập/cháy).",
        correct: "d",
        explanation: "Cầu chì chứa một dây dẫn dễ nóng chảy. Khi dòng điện tăng quá mức, dây chì nóng chảy và đứt, làm hở mạch, bảo vệ các thiết bị khác."
    },
    {
        question: "0,5 mol phân tử Oxygen (O₂) có khối lượng là bao nhiêu?",
        a: "8 gam",
        b: "16 gam",
        c: "32 gam",
        d: "64 gam",
        correct: "b",
        explanation: "Phân tử Oxygen là O₂. M(O₂) = 16 * 2 = 32 g/mol. Khối lượng m = n * M = 0.5 * 32 = 16 gam."
    },
    {
        question: "Quá trình nung đường (sucrose) trên chảo nóng, đường chuyển sang màu nâu rồi thành than đen. Đây là quá trình:",
        a: "Biến đổi vật lý (chỉ thay đổi màu sắc).",
        b: "Biến đổi hóa học (đường bị phân hủy tạo chất mới).",
        c: "Vừa vật lý vừa hóa học.",
        d: "Hiện tượng thăng hoa.",
        correct: "b",
        explanation: "Đường (C₁₂H₂₂O₁₁) khi bị nung nóng sẽ phân hủy thành Carbon (than đen) và nước (bay hơi). Đây là sự tạo thành chất mới, là biến đổi hóa học."
    },
    {
        question: "Cần thêm bao nhiêu gam nước vào 200g dung dịch NaCl 10% để thu được dung dịch NaCl 5%?",
        a: "100 gam",
        b: "200 gam",
        c: "50 gam",
        d: "400 gam",
        correct: "b",
        explanation: "Bước 1 (Tính m_ct): m(ct) = (C% * m(dd)) / 100 = (10 * 200) / 100 = 20 g NaCl. (Khối lượng muối không đổi). Bước 2 (Tính m_dd mới): m(dd_mới) = (m(ct) * 100) / C%_mới = (20 * 100) / 5 = 400 g. Bước 3 (Tính m_nước thêm): m(nước_thêm) = m(dd_mới) - m(dd_cũ) = 400 - 200 = 200 g."
    },
    {
        question: "Thiết bị nào sau đây là NGUỒN điện (có khả năng cung cấp dòng điện)?",
        a: "Bóng đèn LED",
        b: "Vôn kế",
        c: "Công tắc điện",
        d: "Pin (Ắc quy)",
        correct: "d",
        explanation: "Pin và Ắc quy là các nguồn điện hóa học, chúng biến đổi hóa năng thành điện năng để cung cấp cho mạch."
    },
    {
        question: "Cách mắc Ampe kế và Vôn kế vào một bóng đèn để đo CĐDĐ và HĐT của đèn là:",
        a: "Ampe kế mắc nối tiếp, Vôn kế mắc song song.",
        b: "Ampe kế mắc song song, Vôn kế mắc nối tiếp.",
        c: "Cả hai đều mắc nối tiếp.",
        d: "Cả hai đều mắc song song.",
        correct: "a",
        explanation: "Nguyên tắc: Ampe kế có điện trở rất nhỏ, mắc nối tiếp để đo dòng. Vôn kế có điện trở rất lớn, mắc song song để đo hiệu điện thế."
    },
    {
        question: "Hiện tượng sương đọng trên lá cây vào buổi sáng sớm là ví dụ của quá trình nào?",
        a: "Biến đổi hóa học (do lá cây thải ra).",
        b: "Biến đổi vật lý (hơi nước trong không khí ngưng tụ).",
        c: "Quá trình bay hơi.",
        d: "Quá trình quang hợp.",
        correct: "b",
        explanation: "Đây là biến đổi vật lý. Hơi nước (khí) trong không khí gặp lạnh vào ban đêm ngưng tụ thành nước (lỏng), đọng lại trên lá."
    },
    {
        question: "Tính tổng số *nguyên tử* có trong 11 gam khí carbon dioxide (CO₂)? (Cho số Avogadro ≈ 6 x 10²³)",
        a: "1,5 x 10²³ nguyên tử",
        b: "4,5 x 10²³ nguyên tử",
        c: "3,0 x 10²³ nguyên tử",
        d: "6,0 x 10²³ nguyên tử",
        correct: "b",
        explanation: "Bước 1 (Tính mol): M(CO₂) = 12 + 2*16 = 44 g/mol. n(CO₂) = m / M = 11 / 44 = 0,25 mol. Bước 2 (Tính số phân tử): Số phân tử CO₂ = n * (Số Avogadro) = 0,25 * (6 x 10²³) = 1,5 x 10²³ phân tử. Bước 3 (Tính tổng số nguyên tử): 1 phân tử CO₂ có 3 nguyên tử (1 C + 2 O). Tổng số nguyên tử = (Số phân tử) * 3 = (1,5 x 10²³) * 3 = 4,5 x 10²³ nguyên tử."
    }
];
