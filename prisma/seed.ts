// MIRADOR — deterministic seed (T0.4, brief §6.4)
// Menu = §7.5 tables VERBATIM (28 items · 6 sections · bilingual · cents · allergens/diet)
// Edge flags: poached-pear isSoldOut · exactly 3 isSignature (sourdough-butter, ribeye-for-two, dark-chocolate-tart)
// Gallery = §7.7 (8 items, dims verbatim, /img/gallery/<collection>-<n>.avif with n = global index 1–8)
// Demo slot = 12 reservations filling the first Tue–Sun date ≥7 days ahead at 19:00 Damascus local (UTC+3),
//             computed + logged by this script. E2E scripts select their own fresh empty slots.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// (canonical §6.1: allergens/dietTags are native String[] — written as arrays)

type DishSeed = {
  slug: string;
  nameEn: string; descEn: string;
  nameAr: string; descAr: string;
  priceUsd: number;
  allergens: string[];
  dietTags: string[];
  isSignature?: boolean;
  isSoldOut?: boolean;
};

const SECTIONS: { slug: string; titleEn: string; titleAr: string; items: DishSeed[] }[] = [
  {
    slug: "to-begin", titleEn: "To Begin", titleAr: "للبدء",
    items: [
      { slug: "oysters", nameEn: "Oysters", descEn: "Champagne mignonette, shallot, lemon", nameAr: "محار", descAr: "صلصة شامبانيا، ثوم معمر، ليمون", priceUsd: 1800, allergens: ["shellfish"], dietTags: ["pescatarian"] },
      { slug: "beef-tartare", nameEn: "Beef tartare", descEn: "Smoked yolk, capers, rye", nameAr: "طرتار اللحم", descAr: "صفار مدخّن، كبر، خبز الجاودار", priceUsd: 2200, allergens: ["egg", "gluten"], dietTags: [] },
      { slug: "yellowtail-crudo", nameEn: "Yellowtail crudo", descEn: "Blood orange, fennel", nameAr: "كرودو السمك الأصفر", descAr: "برتقال دموي، شمر", priceUsd: 2100, allergens: ["fish"], dietTags: ["pescatarian", "gf"] },
      { slug: "bone-marrow", nameEn: "Roasted bone marrow", descEn: "Parsley, lemon, toast", nameAr: "نخاع العظم المشوي", descAr: "بقدونس، ليمون، خبز محمّص", priceUsd: 1900, allergens: ["gluten"], dietTags: [] },
      { slug: "chilled-vichyssoise", nameEn: "Chilled vichyssoise", descEn: "Chive oil", nameAr: "فيشيسواز بارد", descAr: "ثوم معمر", priceUsd: 1400, allergens: ["dairy"], dietTags: ["vegetarian", "gf"] },
    ],
  },
  {
    slug: "bread-butter", titleEn: "Bread & Butter", titleAr: "الخبز والزبدة",
    items: [
      { slug: "sourdough-butter", nameEn: "Sourdough", descEn: "Cultured butter, sea salt", nameAr: "خبز حمّض", descAr: "زبدة مخمّرة، ملح البحر", priceUsd: 900, allergens: ["gluten", "dairy"], dietTags: ["vegetarian"], isSignature: true },
      { slug: "focaccia", nameEn: "Focaccia", descEn: "Rosemary, olive oil", nameAr: "فوكاتشا", descAr: "إكليل الجبل، زيت زيتون", priceUsd: 800, allergens: ["gluten"], dietTags: ["vegan"] },
      { slug: "rye-praline", nameEn: "Rye", descEn: "Hazelnut praline butter", nameAr: "خبز جاودار", descAr: "زبدة البرالينيه بالبندق", priceUsd: 1000, allergens: ["gluten", "dairy", "nuts"], dietTags: ["vegetarian"] },
      { slug: "marrow-butter-toast", nameEn: "Grilled country bread", descEn: "Bone marrow butter", nameAr: "خبز ريفي مشوي", descAr: "زبدة نخاع العظم، ثوم", priceUsd: 1100, allergens: ["gluten", "dairy"], dietTags: [] },
    ],
  },
  {
    slug: "from-the-hearth", titleEn: "From the Hearth", titleAr: "من الموقد",
    items: [
      { slug: "charred-leeks", nameEn: "Charred leeks", descEn: "Romesco, toasted almond", nameAr: "كرّاث محمّر", descAr: "رومسكو، لوز محمّص", priceUsd: 1600, allergens: ["nuts"], dietTags: ["vegan", "gf"] },
      { slug: "roasted-beetroot", nameEn: "Roasted beetroot", descEn: "Whipped goat cheese", nameAr: "شمندر مشوي", descAr: "جبن ماعز مخفوق، عسل", priceUsd: 1500, allergens: ["dairy"], dietTags: ["vegetarian", "gf"] },
      { slug: "grilled-octopus", nameEn: "Grilled octopus", descEn: "Smoked paprika, potato", nameAr: "أخطبوط مشوي", descAr: "بابريكا مدخّنة، بطاطا، ليمون", priceUsd: 2400, allergens: ["shellfish"], dietTags: ["gf"] },
      { slug: "whole-sea-bream", nameEn: "Whole sea bream", descEn: "Charred lemon, herbs", nameAr: "قاروص كامل", descAr: "ليمون محمّر، زيت زيتون", priceUsd: 3200, allergens: ["fish"], dietTags: ["pescatarian", "gf"] },
      { slug: "dry-aged-duck", nameEn: "Dry-aged duck breast", descEn: "Cherry jus", nameAr: "صدر بطة معتّق", descAr: "مرق كرز، شمندر", priceUsd: 2900, allergens: [], dietTags: ["gf"] },
    ],
  },
  {
    slug: "mains", titleEn: "Mains", titleAr: "الأطباق الرئيسية",
    items: [
      { slug: "braised-short-rib", nameEn: "Slow-braised short rib", descEn: "Celeriac, juniper", nameAr: "ضلع بقري مطهو ببطء", descAr: "كرفس، جونيبر", priceUsd: 3400, allergens: ["dairy"], dietTags: ["gf"] },
      { slug: "dover-sole", nameEn: "Dover sole", descEn: "Brown butter, capers", nameAr: "سول دوفر", descAr: "زبدة بنية، كبر، ليمون", priceUsd: 3800, allergens: ["fish", "dairy"], dietTags: ["pescatarian", "gf"] },
      { slug: "ribeye-for-two", nameEn: "MIRADOR ribeye for two", descEn: "Embered bone marrow, sea salt, smoked butter", nameAr: "ريباي ميرادور لشخصين", descAr: "نخاع على الجمر، ملح البحر، زبدة مدخّنة", priceUsd: 8900, allergens: ["dairy"], dietTags: ["gf"], isSignature: true },
      { slug: "wild-mushroom-risotto", nameEn: "Wild mushroom risotto", descEn: "Aged parmesan, truffle oil", nameAr: "ريزوتو الفطر البري", descAr: "بارميزان معتّق، زيت كمأة", priceUsd: 2600, allergens: ["dairy"], dietTags: ["vegetarian", "gf"] },
      { slug: "corn-fed-chicken", nameEn: "Corn-fed chicken", descEn: "Burnt lemon pan sauce", nameAr: "دجاج بذرة الذرة", descAr: "صلصة ليمون محروق", priceUsd: 2800, allergens: ["dairy"], dietTags: ["gf"] },
    ],
  },
  {
    slug: "sides", titleEn: "Sides", titleAr: "الجانبات",
    items: [
      { slug: "hand-cut-fries", nameEn: "Hand-cut fries", descEn: "Rosemary salt", nameAr: "بطاطا مقطعة يدوياً", descAr: "إكليل الجبل، ملح بحري", priceUsd: 800, allergens: [], dietTags: ["vegan", "gf"] },
      { slug: "charred-cabbage", nameEn: "Charred hispi cabbage", descEn: "Anchovy cream, lemon", nameAr: "ملفوف محمّر", descAr: "كريمة الأنشوغة، ليمون", priceUsd: 900, allergens: ["dairy", "fish"], dietTags: [] },
      { slug: "triple-cooked-potatoes", nameEn: "Triple-cooked potatoes", descEn: "Chicken fat, garlic", nameAr: "بطاطا ثلاثية الطهي", descAr: "دهن دجاج، ثوم، أعشاب", priceUsd: 900, allergens: [], dietTags: ["gf"] },
      { slug: "wilted-spinach", nameEn: "Wilted spinach", descEn: "Garlic, chili", nameAr: "سبانخ", descAr: "ثوم، فلفل حار، زيت زيتون", priceUsd: 700, allergens: [], dietTags: ["vegan", "gf"] },
    ],
  },
  {
    slug: "to-finish", titleEn: "To Finish", titleAr: "للختام",
    items: [
      { slug: "dark-chocolate-tart", nameEn: "Dark chocolate tart", descEn: "Olive oil, sea salt", nameAr: "تارت الشوكولاتة الداكنة", descAr: "زيت زيتون، ملح البحر", priceUsd: 1200, allergens: ["gluten", "dairy", "egg"], dietTags: ["vegetarian"], isSignature: true },
      { slug: "basque-cheesecake", nameEn: "Burnt Basque cheesecake", descEn: "Caramel, cream", nameAr: "تشيز كيك باسكي محروق", descAr: "كراميل، كريمة", priceUsd: 1100, allergens: ["gluten", "dairy", "egg"], dietTags: ["vegetarian"] },
      { slug: "poached-pear", nameEn: "Poached pear", descEn: "Elderflower, almond", nameAr: "كمثرى مسلوقة", descAr: "زهر الخميلة، لوز", priceUsd: 1000, allergens: ["nuts"], dietTags: ["vegetarian", "gf"], isSoldOut: true },
      { slug: "creme-brulee", nameEn: "Crème brûlée", descEn: "Vanilla, hard caramel", nameAr: "كريم بروليه", descAr: "فانيلا، كراميل هشّ", priceUsd: 1000, allergens: ["dairy", "egg"], dietTags: ["vegetarian", "gf"] },
      { slug: "cheese-board", nameEn: "Cheese board for two", descEn: "Five cheeses, honey", nameAr: "طبق أجبان لشخصين", descAr: "خمسة أجبان، عسل، مكسرات", priceUsd: 1800, allergens: ["dairy", "nuts"], dietTags: ["vegetarian", "gf"] },
    ],
  },
];

const GALLERY: { titleEn: string; titleAr: string; captionEn: string; captionAr: string; collection: string; w: number; h: number }[] = [
  { titleEn: "The City, Switched On", titleAr: "المدينة تُضاء", captionEn: "Dusk falling over the rooftops", captionAr: "الغسق يهبط فوق الأسطح", collection: "Skyline", w: 2560, h: 1440 },
  { titleEn: "Long Exposure", titleAr: "تعرّض طويل", captionEn: "Light trails below the sixth floor", captionAr: "مسارات النور تحت الطابق السادس", collection: "Skyline", w: 2560, h: 1440 },
  { titleEn: "The Pass, 21:00", titleAr: "ممر المطبخ، 21:00", captionEn: "Mid-service choreography", captionAr: "تناغم منتصف الخدمة", collection: "Fire", w: 1080, h: 1350 },
  { titleEn: "Embers", titleAr: "جمر", captionEn: "The hearth between services", captionAr: "الموقد بين خدمتين", collection: "Fire", w: 1080, h: 1350 },
  { titleEn: "A Single Place Set", titleAr: "غطاء واحد", captionEn: "Mise en place before opening", captionAr: "الترتيب قبل الافتتاح", collection: "Plates", w: 1080, h: 1350 },
  { titleEn: "First Pour", titleAr: "السكب الأول", captionEn: "The opening course leaving the pass", captionAr: "الطبق الأول يغادر المطبخ", collection: "Plates", w: 1080, h: 1350 },
  { titleEn: "Amber Glass", titleAr: "زجاج عنبري", captionEn: "The window at last light", captionAr: "النافذة عند آخر ضوء", collection: "Room", w: 1080, h: 1350 },
  { titleEn: "The Final Flight", titleAr: "الدرج الأخير", captionEn: "Stairs to the sixth floor", captionAr: "سلالم الطابق السادس", collection: "Room", w: 1080, h: 1350 },
];

/** First Tue–Sun date ≥7 days ahead at 19:00 Damascus local (UTC+3, no DST), as a UTC instant. */
function demoSlot(): Date {
  const now = new Date();
  const local = new Date(now.getTime() + 3 * 3600_000); // Damascus wall clock
  const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 7));
  while (d.getUTCDay() === 1) d.setUTCDate(d.getUTCDate() + 1); // closed Monday
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 16, 0, 0, 0)); // 19:00 local = 16:00 UTC
}

const DEMO_NAMES = [
  "Layal Haddad", "Rami Safi", "Nour Al-Khatib", "Hadi Barakat", "Yara Mansour",
  "Faisal Al-Azm", "Salma Qabbani", "Omar Haidar", "Rana Al-Attar", "Ziad Malas",
  "Maya Dannawi", "Kareem Zahreddine",
];

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuSection.deleteMany();
  await prisma.galleryItem.deleteMany();

  // — menu: §7.5 verbatim —
  for (const [si, section] of SECTIONS.entries()) {
    const created = await prisma.menuSection.create({
      data: { slug: section.slug, titleEn: section.titleEn, titleAr: section.titleAr, sortOrder: si },
    });
    for (const [ii, dish] of section.items.entries()) {
      await prisma.menuItem.create({
        data: {
          sectionId: created.id,
          slug: dish.slug,
          nameEn: dish.nameEn, descEn: dish.descEn,
          nameAr: dish.nameAr, descAr: dish.descAr,
          priceUsd: dish.priceUsd,
          allergens: dish.allergens,
          dietTags: dish.dietTags,
          isSignature: dish.isSignature ?? false,
          isSoldOut: dish.isSoldOut ?? false,
          imageUrl: dish.isSignature ? `/img/menu/${dish.slug}.avif` : null,
          sortOrder: ii,
        },
      });
    }
  }

  // — gallery: §7.7 (n = global index 1–8) —
  for (const [i, g] of GALLERY.entries()) {
    const n = i + 1;
    await prisma.galleryItem.create({
      data: {
        titleEn: g.titleEn, titleAr: g.titleAr,
        captionEn: g.captionEn, captionAr: g.captionAr,
        imageUrl: `/img/gallery/${g.collection.toLowerCase()}-${n}.avif`,
        width: g.w, height: g.h,
        collection: g.collection,
        sortOrder: i,
      },
    });
  }

  // — demo slot: 12 reservations, distinct phones, tables 1–12 —
  const slot = demoSlot();
  for (let t = 1; t <= 12; t++) {
    const name = DEMO_NAMES[t - 1]!;
    await prisma.reservation.create({
      data: {
        name,
        phone: `+96395512345${String(t).padStart(2, "0")}`,
        partySize: (t % 4) + 1,
        slot,
        tableNumber: t,
        status: "PENDING",
        locale: t % 2 === 0 ? "AR" : "EN",
      },
    });
  }

  const counts = {
    sections: await prisma.menuSection.count(),
    items: await prisma.menuItem.count(),
    signature: await prisma.menuItem.count({ where: { isSignature: true } }),
    soldOut: await prisma.menuItem.count({ where: { isSoldOut: true } }),
    gallery: await prisma.galleryItem.count(),
    reservations: await prisma.reservation.count(),
  };
  console.log("[seed] done:", JSON.stringify(counts));
  console.log(`[seed] demo slot (12/12 tables full): ${slot.toISOString()} — Damascus local ${slot.toISOString().slice(0, 10)} 19:00`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
