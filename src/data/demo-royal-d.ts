import type { Project } from '../types';

export const royalDProject: Project = {
  id: 'demo-royal-d',
  slug: 'royal-d',
  name: 'Royal-D LED Installation Proposal',
  clientName: 'Royal-D',
  description:
    'ข้อเสนอการออกแบบและติดตั้งจอแสดงผล LED คุณภาพสูงสำหรับอาคาร Royal-D เพื่อยกระดับภาพลักษณ์องค์กร เพิ่มประสิทธิภาพการสื่อสารแบรนด์ และดึงดูดสายตาจากทุกมุมมองของผู้สัญจร',
  location: 'กรุงเทพมหานคร / นนทบุรี',
  installationType: 'Outdoor Architectural LED Display',
  coverImage: '/demo/royal-d/facade-after.png',
  status: 'published',
  language: 'th',
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-16T00:00:00Z',

  branding: {
    primaryColor: '#10B981',
    secondaryColor: '#3B82F6',
    theme: 'dark',
    clientLogo: '',
    heroImage: '/demo/royal-d/facade-after.png',
    heroHeadline: 'Royal-D LED Display Proposal',
    heroSubheadline:
      'สัมผัสภาพจำลองการติดตั้งจอ LED ระดับพรีเมียมบนตัวอาคารจริง เปรียบเทียบมุมมองก่อน-หลังการติดตั้ง และรับชมวิดีโอสาธิตการแสดงผลโฆษณาเสมือนจริง',
    closingHeadline: 'ยกระดับอาคาร Royal-D สู่สัญลักษณ์แห่งอนาคต',
    closingDescription:
      'ด้วยเทคโนโลยีจอ LED มาตรฐานสากลจาก JLED อาคาร Royal-D จะโดดเด่น คมชัดทุกสภาพแสง และสร้างผลกระทบต่อสายตากลุ่มเป้าหมายได้อย่างทรงพลังและคุ้มค่าสูงสุด',
    closingImage: '/demo/royal-d/facade-angle-after.png',
    contactInfo: 'บริษัท เจแอลอีดี จำกัด (JLED Co., Ltd.) | โทร: 02-877-2266 | Line: @jled | อีเมล: contact@jled.co.th',
  },

  sections: [
    {
      id: 'sec-hero',
      sectionType: 'hero',
      title: 'Royal-D LED Display Proposal',
      description:
        'สัมผัสภาพจำลองการติดตั้งจอ LED ระดับพรีเมียมบนตัวอาคารจริง เปรียบเทียบมุมมองก่อน-หลังการติดตั้ง และรับชมวิดีโอสาธิตการแสดงผลโฆษณาเสมือนจริง',
      sortOrder: 0,
      enabled: true,
    },
    {
      id: 'sec-before-after',
      sectionType: 'before-after',
      title: 'ภาพเปรียบเทียบ ก่อน & หลังติดตั้ง',
      description: 'เลื่อนแถบสไลเดอร์เพื่อเปรียบเทียบภาพถ่ายสถานที่เดิมกับภาพจำลองการติดตั้งจอ LED เสมือนจริงบนอาคาร Royal-D',
      sortOrder: 1,
      enabled: true,
    },
    {
      id: 'sec-perspectives',
      sectionType: 'perspectives',
      title: 'มุมมองการติดตั้งหลากหลายมิติ',
      description: 'สำรวจทัศนียภาพและมุมมองจากแต่ละทิศทาง เพื่อเห็นภาพรวมของการผสานจอ LED เข้ากับสถาปัตยกรรมของอาคารอย่างลงตัว',
      sortOrder: 2,
      enabled: true,
    },
    {
      id: 'sec-video',
      sectionType: 'video-showcase',
      title: 'วิดีโอจำลองการแสดงผลบนจอ LED',
      description: 'รับชมวิดีโอตัวอย่างคอนเทนต์โฆษณาและการเคลื่อนไหวเสมือนจริงบนจอ LED ของอาคาร Royal-D',
      sortOrder: 3,
      enabled: true,
    },
    {
      id: 'sec-specs',
      sectionType: 'specifications',
      title: 'ข้อมูลจำเพาะทางเทคนิค',
      description: 'รายละเอียดมาตรฐานทางเทคนิคของระบบจอ LED โครงสร้าง และระบบควบคุมที่ออกแบบเฉพาะสำหรับโครงการนี้',
      sortOrder: 4,
      enabled: true,
    },
    {
      id: 'sec-closing',
      sectionType: 'closing',
      title: 'ยกระดับอาคาร Royal-D สู่สัญลักษณ์แห่งอนาคต',
      sortOrder: 5,
      enabled: true,
    },
  ],

  beforeAfterSets: [
    {
      id: 'ba-facade',
      title: 'จุดที่ 1: ด้านหน้าอาคาร (กระจกชั้น 2)',
      beforeImage: '/demo/royal-d/facade-before.jpg',
      afterImage: '/demo/royal-d/facade-after.png',
      sortOrder: 0,
    },
    {
      id: 'ba-side',
      title: 'จุดที่ 2: ผนังข้างอาคาร',
      beforeImage: '/demo/royal-d/side-before.jpg',
      afterImage: '/demo/royal-d/side-after.png',
      sortOrder: 1,
    },
    {
      id: 'ba-white',
      title: 'จุดที่ 3: ผนังขาวด้านข้าง',
      beforeImage: '/demo/royal-d/white-wall-before.jpg',
      afterImage: '/demo/royal-d/white-wall-after.png',
      sortOrder: 2,
    },
  ],

  installationViews: [
    {
      id: 'view-facade-front',
      viewName: 'จุดที่ 1: หน้าอาคารมุมตรง (Front Facade)',
      imageUrl: '/demo/royal-d/facade-after.png',
      description: 'ภาพจำลองการติดตั้งจอ LED บนแนวผนังกระจกชั้น 2 ด้านหน้าอาคาร เห็นชัดเจนจากถนนหลัก',
      sortOrder: 0,
    },
    {
      id: 'view-facade-angle',
      viewName: 'จุดที่ 1: หน้าอาคารมุมเฉียง (Angled Perspective)',
      imageUrl: '/demo/royal-d/facade-angle-after.png',
      description: 'มุมมององศาเฉียงจากทางเดินเท้าและถนน แสดงมิติความกลมกลืนกับฟาซาดกระจกของอาคาร',
      sortOrder: 1,
    },
    {
      id: 'view-side-wall',
      viewName: 'จุดที่ 2: ผนังข้างอาคาร (Side Wall Display)',
      imageUrl: '/demo/royal-d/side-after.png',
      description: 'ภาพจำลองจอ LED ติดตั้งบริเวณผนังข้างอาคาร รับสายตาจากทิศทางการจราจรฝั่งเข้าสู่ตัวเมือง',
      sortOrder: 2,
    },
    {
      id: 'view-white-wall',
      viewName: 'จุดที่ 3: ผนังขาวด้านข้าง (White Wall)',
      imageUrl: '/demo/royal-d/white-wall-after.png',
      description: 'มุมมองการติดตั้งเสริมบนผนังโครงสร้างหลัก เพิ่มการรับรู้จากทุกทิศทาง',
      sortOrder: 3,
    },
    {
      id: 'view-original-site',
      viewName: 'สถานที่เดิมก่อนการติดตั้ง (Original Facade)',
      imageUrl: '/demo/royal-d/facade-before.jpg',
      description: 'ภาพถ่ายสภาพปัจจุบันของอาคาร Royal-D ก่อนเริ่มดำเนินการติดตั้งระบบจอแสดงผล',
      sortOrder: 4,
    },
  ],

  videos: [
    {
      id: 'vid-facade',
      title: 'จำลองภาพเคลื่อนไหวจอ LED — ด้านหน้าอาคาร (Front Facade)',
      videoUrl: '/demo/royal-d/facade-video.mp4',
      thumbnailUrl: '/demo/royal-d/facade-after.png',
      sortOrder: 0,
    },
    {
      id: 'vid-side',
      title: 'จำลองภาพเคลื่อนไหวจอ LED — ผนังข้างอาคาร (Side Wall)',
      videoUrl: '/demo/royal-d/side-video.mp4',
      thumbnailUrl: '/demo/royal-d/side-after.png',
      sortOrder: 1,
    },
  ],

  specifications: [
    { id: 'spec-1', fieldName: 'ประเภทจอแสดงผล (Display Type)', fieldValue: 'Outdoor LED Full Color', unit: '', sortOrder: 0 },
    { id: 'spec-2', fieldName: 'ระยะพิทช์หลอด (Pixel Pitch)', fieldValue: 'P4 / P5 High Refresh', unit: 'mm', sortOrder: 1 },
    { id: 'spec-3', fieldName: 'ระดับความสว่าง (Brightness)', fieldValue: '6,500 – 7,500', unit: 'nits (cd/m²)', sortOrder: 2 },
    { id: 'spec-4', fieldName: 'อัตรารีเฟรชเรท (Refresh Rate)', fieldValue: '3,840', unit: 'Hz', sortOrder: 3 },
    { id: 'spec-5', fieldName: 'มาตรฐานกันน้ำกันฝุ่น (IP Rating)', fieldValue: 'IP65 (Front) / IP54 (Rear)', unit: '', sortOrder: 4 },
    { id: 'spec-6', fieldName: 'มุมมองการรับชม (Viewing Angle)', fieldValue: '160° แนวนอน / 140° แนวตั้ง', unit: '', sortOrder: 5 },
    { id: 'spec-7', fieldName: 'ระบบการซ่อมบำรุง (Maintenance)', fieldValue: 'Front & Rear Service', unit: '', sortOrder: 6 },
    { id: 'spec-8', fieldName: 'ระบบควบคุมคอนเทนต์ (Control System)', fieldValue: 'NovaStar Cloud Synchronous / Asynchronous', unit: '', sortOrder: 7 },
    { id: 'spec-9', fieldName: 'อายุการใช้งานหลอด LED (Lifespan)', fieldValue: '100,000', unit: 'ชั่วโมง', sortOrder: 8 },
    { id: 'spec-10', fieldName: 'การรับประกันและบริการ (Warranty)', fieldValue: '2 ปีเต็ม พร้อมทีม Service ตลอด 24 ชม.', unit: '', sortOrder: 9 },
  ],
};
