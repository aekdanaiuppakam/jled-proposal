# JLED Interactive Proposal Builder

ระบบสร้างและนำเสนอข้อเสนอติดตั้งจอ LED ระดับพรีเมียม (Interactive Architectural Presentation Platform)

---

## 🌟 ฟังก์ชันหลัก (Key Features)

### 1. Client Presentation (หน้าเว็บไซต์นำเสนอสำหรับลูกค้า)
- **Cinematic Hero**: ส่วนเปิดหัวข้อโครงการแบบสถาปัตยกรรมระดับพรีเมียม พร้อมชื่อลูกค้า โลโก้ และปุ่มเลื่อนชมโครงการ
- **Interactive Before & After Slider**: แถบสไลเดอร์เปรียบเทียบสถานที่จริงก่อนและหลังติดตั้งจอ LED รองรับ Touch Drag บนมือถือ, ลากเมาส์บนเดสก์ท็อป และปุ่มคีย์บอร์ด
- **Installation Perspectives Gallery**: แกลเลอรีมุมมองหลากหลายมิติ (ด้านหน้า, ซ้าย, ขวา, ระยะไกล, ระยะใกล้) พร้อมแอนิเมชัน Crossfade, รองรับ Swipe ท่าทางบนมือถือ และโหมดดูภาพเต็มจอ (Fullscreen Modal)
- **LED Video Showcase**: เครื่องเล่นวิดีโอแสดงผลตัวอย่างสื่อโฆษณา/คอนเทนต์บนจอ LED พร้อมปุ่มเล่นสไตล์มินิมอลและรองรับหลายคลิป
- **Technical Specifications Panel**: แผงข้อมูลจำเพาะทางวิศวกรรมแบบ Glassmorphism สวยงาม พร้อมระบบจัดการหน่วยและสถานะ "To Be Confirmed" สำหรับข้อมูลที่ยังไม่ระบุ
- **Project Vision & Closing**: ส่วนสรุปท้ายโครงการอย่างเป็นมืออาชีพ พร้อมข้อมูลติดต่อ JLED

### 2. Admin Dashboard & Project Editor (ระบบจัดการหลังบ้าน)
- **แดชบอร์ดโครงการ**: แสดงรายการโปรเจกต์ทั้งหมด ค้นหา กรองสถานะ (เผยแพร่แล้ว / แบบร่าง / จัดเก็บ)
- **การจัดการโปรเจกต์**: สร้างใหม่, คัดลอก (Duplicate), จัดเก็บ (Archive), ลบ (Delete พร้อมกล่องยืนยัน)
- **Editor ครอบคลุม 8 หมวดหมู่**:
  1. **ข้อมูลทั่วไป (General)**: ชื่อโครงการ, ชื่อลูกค้า, URL Slug, รายละเอียด, สถานที่, ประเภทการติดตั้ง
  2. **อัตลักษณ์และธีม (Branding)**: ตัวเลือกสี Accent Color (พร้อม Palette สำเร็จรูป), สลับ Dark/Light Theme, โลโก้ลูกค้า, รูป Hero, ข้อความปิดท้าย พร้อมแผง **Live Preview** แสดงผลสีจริงทันที
  3. **ภาพก่อน & หลัง (Before & After)**: เพิ่ม ลบ เรียงลำดับ และอัปเดตรูปเปรียบเทียบได้หลายชุด
  4. **มุมมองการติดตั้ง (Perspectives)**: เพิ่มมุมมองต่างๆ พร้อมคำบรรยายและพรีวิวภาพ
  5. **วิดีโอตัวอย่าง (Videos)**: จัดการ URL วิดีโอ (MP4/Web) และรูปภาพหน้าปก
  6. **ข้อมูลจำเพาะ (Specs)**: ตารางสเปกเทคนิค พร้อมปุ่มเทมเพลตมาตรฐาน (Pixel Pitch, ความสว่าง, Refresh Rate ฯลฯ)
  7. **จัดการส่วนแสดงผล (Sections)**: เปิด/ปิดการแสดงผลแต่ละส่วน และสลับลำดับการแสดงผลขึ้น-ลงได้อิสระ
  8. **พรีวิวและเผยแพร่ (Preview & Publish)**: สลับสถานะ Published/Draft, คัดลอกลิงก์แชร์, และกล่องทดลองเปิดดูแบบ Desktop, Tablet และ Mobile

### 3. Demo Project — Royal-D
- บรรจุโครงการตัวอย่าง **"Royal-D LED Installation Proposal"** พร้อมใช้งานทันที
- ข้อมูลจำลองและภาพตัวอย่างครบถ้วนทุกส่วน
- เข้าชมได้ทันทีที่ `/p/royal-d`

---

## 🛠️ Technology Stack
- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism CSS Design Tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **Persistence**: Reactive Store Layer (`useSyncExternalStore` + `localStorage`), สถาปัตยกรรมพร้อมเชื่อมต่อ Supabase Database & Auth ได้ทันที

---

## 🚀 วิธีการติดตั้งและรันโครงการ (Getting Started)

1. เข้าไปยังโฟลเดอร์โครงการ:
```bash
cd jled-proposal
```

2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง):
```bash
npm install
```

3. รัน Development Server:
```bash
npm run dev
```
เข้าใช้งานผ่านเบราว์เซอร์:
- **Admin Dashboard**: `http://localhost:5173/admin`
- **Royal-D Client Presentation**: `http://localhost:5173/p/royal-d`

4. ตรวจสอบโค้ดและสร้าง Production Build:
```bash
npm run lint
npm run build
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx        # เลย์เอาต์หลักของแผงผู้ดูแล พร้อม Sidebar พับเก็บได้
│   │   └── ProjectCard.tsx        # การ์ดแสดงโปรเจกต์พร้อมสถานะและเมนูจัดการ
│   └── presentation/
│       ├── BeforeAfterSlider.tsx  # คอมโพเนนต์เปรียบเทียบภาพก่อน-หลังแบบลาก
│       ├── ImageModal.tsx         # โมดอลซูมดูภาพขนาดใหญ่เต็มจอ
│       ├── PerspectiveGallery.tsx # แกลเลอรีแสดงมุมมองการติดตั้งหลายมิติ
│       ├── PresentationNav.tsx    # แถบนำทางด้านบนแบบใส/เบลอขณะเลื่อนจอ
│       ├── ProjectClosing.tsx     # ส่วนปิดท้ายและสรุปวิสัยทัศน์โครงการ
│       ├── ProjectHero.tsx        # ส่วนเปิดหัวข้อโครงการแบบ Cinematic
│       ├── SectionWrapper.tsx     # Wrapper กำกับขอบเขตและแอนิเมชันเปิดส่วนต่างๆ
│       ├── SpecificationPanel.tsx # ตารางข้อมูลจำเพาะทางเทคนิค
│       └── VideoShowcase.tsx      # เครื่องเล่นวิดีโอตัวอย่างคอนเทนต์จอ LED
├── data/
│   └── demo-royal-d.ts            # ข้อมูลตัวอย่างโครงการ Royal-D
├── hooks/
│   └── useProjects.ts             # Custom Hooks ซิงก์ข้อมูลอัตโนมัติ
├── lib/
│   └── utils.ts                   # ยูทิลิตี้ฟังก์ชัน (Branding CSS, Slug, Date format)
├── pages/
│   ├── AdminDashboard.tsx         # หน้าหลักแผงควบคุมของผู้ดูแลระบบ
│   ├── CreateProjectPage.tsx      # แบบฟอร์มสร้างโปรเจกต์ใหม่
│   ├── PresentationPage.tsx       # หน้านำเสนอสำหรับลูกค้า (/p/:slug)
│   └── ProjectEditorPage.tsx      # หน้าตัวแก้ไขโปรเจกต์ 8 แท็บ
├── store/
│   └── projectStore.ts            # Data Layer จัดการข้อมูล CRUD และ Event Store
├── types/
│   └── index.ts                   # TypeScript Interfaces และ Type Definitions
├── App.tsx                        # กำหนดเส้นทาง URL Routing
├── index.css                      # Global Styles, Tailwind v4 และ Design Tokens
└── main.tsx                       # จุดเริ่มต้นของแอปพลิเคชัน
```
