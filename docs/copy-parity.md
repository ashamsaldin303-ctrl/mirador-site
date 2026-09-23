# docs/copy-parity.md — bilingual copy parity audit (F9-5)

Every §7 UI string (plus structural labels disclosed in worklog) as an AR/EN
pair — generated from `content/en.json` + `content/ar.json` by `pnpm audit:copy`
(167 rows).

| key | EN | AR |
|---|---|---|
| acts.act1.copy | The city switches on, window by window. From up here, its lights read as embers. | تُشعل المدينة أنوارها نافذةً نافذة. من هنا تبدو أنوارها جمراً. |
| acts.act1.numeral | ACT I | الفصل الأول |
| acts.act1.title | I — Dusk | الغسق |
| acts.act2.copy | In the kitchen, fire does the quiet work — a slow braise, a hissing plancha, patience. | في المطبخ تقوم النار بالعمل الهادئ: طهيٌ بطيء، وصفيحة تزمجر، وصبر. |
| acts.act2.numeral | ACT II | الفصل الثاني |
| acts.act2.title | II — Fire | النار |
| acts.act3.copy | Six floors above the street, one table holds the whole skyline. Yours for the evening. | ستة طوابق فوق الشارع، مائدة واحدة تحتضن الأفق كله. لك هذا المساء. |
| acts.act3.numeral | ACT III | الفصل الثالث |
| acts.act3.title | III — The Table | المائدة |
| band.cta | Reserve a table | احجز طاولتك |
| band.hours | Tuesday – Sunday, 18:00 – 23:30 · kitchen last order 22:45 · closed Monday | الثلاثاء – الأحد، 18:00 – 23:30 · آخر طلب للمطبخ 22:45 · مغلق يوم الاثنين |
| band.sub | Reserve in under ninety seconds. | احجز في أقل من تسعين ثانية. |
| band.title | The table is set. | المائدة جاهزة. |
| confirm.date | Date | التاريخ |
| confirm.name | Name | الاسم |
| confirm.note | We hold your table for 15 minutes past the time. | نحفظ طاولتك لخمس عشرة دقيقة بعد الموعد. |
| confirm.party | Party | عدد الضيوف |
| confirm.table | Table | الطاولة |
| confirm.time | Time | الوقت |
| confirm.title | The table is yours. | الطاولة لك. |
| confirm.whatsapp | Confirm on WhatsApp | أكّد عبر واتساب |
| contact.addressLabel | Address | العنوان |
| contact.closedMonday | Closed Monday | مغلق يوم الاثنين |
| contact.emailLabel | Email | البريد الإلكتروني |
| contact.h1 | Contact | اتصل بنا |
| contact.hoursLabel | Hours | أوقات العمل |
| contact.phoneLabel | Phone | الهاتف |
| contact.whatsappCta | Message us on WhatsApp | راسلنا عبر واتساب |
| contact.whatsappNote | Opens WhatsApp — an external app. | يفتح واتساب — تطبيق خارجي. |
| errors.duplicate | You already hold a reservation at this time. | لديك حجز في هذا الوقت مسبقاً. |
| errors.invalid_date | Please choose a valid date. | اختر تاريخاً صحيحاً. |
| errors.invalid_message | Please write a few words (10–1000 characters). | اكتب بضع كلمات (10–1000 حرف). |
| errors.invalid_name | Please use a valid name. | أدخل اسماً صحيحاً. |
| errors.invalid_party | Please choose a party size from 1 to 12. | اختر عدد ضيوف بين 1 و 12. |
| errors.invalid_phone | Please use a valid phone number. | أدخل رقم هاتف صحيحاً. |
| errors.invalid_slot | Please choose an available time. | اختر وقتاً متاحاً. |
| errors.network | Something failed on our side. Try again — the city is still there. | خطأ من جهتنا. أعد المحاولة — المدينة ما تزال هناك. |
| errors.rateLimited | Too many requests — please wait a moment. | طلبات كثيرة — انتظر لحظة. |
| errors.required | Please fill in this field. | أكمل هذا الحقل. |
| errors.slotFull | That time is fully booked tonight. | هذا الوقت محجوز بالكامل لهذه الليلة. |
| errors.validation | Check the highlighted fields. | تحقّق من الحقول المحددة. |
| footer.addressLabel | Address | العنوان |
| footer.hoursLabel | Hours | أوقات العمل |
| footer.legal | © 2026 MIRADOR — Damascus | © 2026 ميرادور — دمشق |
| footer.reservationsLabel | Reservations | الحجوزات |
| footer.sypLine | Prices in SYP are indicative, converted at 12,500 SYP per USD and rounded to the nearest 500. USD prices are authoritative. | الأسعار بالليرة السورية استرشادية، محسوبة بسعر 12,500 ل.س للدولار وتُقرَّب لأقرب 500. الأسعار بالدولار هي المرجع. |
| forms.message | Message | الرسالة |
| forms.name | Name | الاسم |
| forms.partySize | Party size | عدد الضيوف |
| forms.phone | Phone | الهاتف |
| forms.preferredDate | Preferred date | التاريخ المفضل |
| forms.submit | Send inquiry | أرسل الاستفسار |
| forms.submitting | Sending… | جارٍ الإرسال… |
| gallery.close | Close | إغلاق |
| gallery.counter | of | من |
| gallery.floorTag | Floor | الطابق |
| gallery.h1 | Gallery | المعرض |
| gallery.imageFail | This image rests tonight — the caption remains. | هذه الصورة ترتاح الليلة — التعليق باقٍ. |
| gallery.next | Next image | الصورة التالية |
| gallery.prev | Previous image | الصورة السابقة |
| gallery.sighting.0 | From the sixth floor, the city keeps its own hours. | من الطابق السادس، تعيش المدينة على وقتها الخاص. |
| gallery.sighting.1 | Six floors up, the traffic below reads as candlelight. | ستة طوابق فوق، يصير المرور تحته شموعاً. |
| gallery.sighting.2 | The second floor's fire works all evening. | نار الطابق الثاني تشتغل طوال المساء. |
| gallery.sighting.3 | On the second floor, the hearth banks itself between services. | في الطابق الثاني، يخمد الموقد بين خدمتين. |
| gallery.sighting.4 | A place set on the fifth floor, waiting. | غطاءٌ في الطابق الخامس، بانتظار. |
| gallery.sighting.5 | The fifth floor's first pour, at opening. | أول سكبٍ في الطابق الخامس، عند الافتتاح. |
| gallery.sighting.6 | The fourth-floor window holds the day's last amber. | نافذة الطابق الرابع تحفظ آخر عنبرٍ من النهار. |
| gallery.sighting.7 | The final flight ends six floors above the street. | الدرج الأخير ينتهي ستة طوابق فوق الشارع. |
| hero.cta | Reserve a table | احجز طاولتك |
| hero.line | Above the city, a table worth the climb. | فوق المدينة، مائدة تستحقّ الصعود. |
| hero.quiet | The menu | القائمة |
| intro.hud | MIRADOR — DAMASCUS | ميرادور — دمشق |
| intro.paragraph | MIRADOR sits six floors above Damascus — one dining room, one long window, and a kitchen that answers to fire. We serve an international table: French technique, Mediterranean produce, no shortcuts. Below you, the city; above it, you. | يجلس «ميرادور» في الطابق السادس فوق دمشق: قاعة واحدة، نافذة ممتدة، ومطبخ يستجيب للنار. نقدّم مائدة عالمية: تقنية فرنسية، ومنتجات متوسطية، بلا اختصارات. تحتك المدينة، وفوقها أنت. |
| journey.hud | THE SIGNATURE JOURNEY | الرحلة المميزة |
| menu.allergen.dairy | Dairy | حليب |
| menu.allergen.egg | Egg | بيض |
| menu.allergen.fish | Fish | سمك |
| menu.allergen.gluten | Gluten | غلوتين |
| menu.allergen.nuts | Nuts | مكسرات |
| menu.allergen.shellfish | Shellfish | محار |
| menu.filter.countFew | dishes | أطباق |
| menu.filter.countMany | dishes | طبقاً |
| menu.filter.countOne | dish | طبق |
| menu.filter.countOther | dishes | طبق |
| menu.filter.countPlural | dishes | أطباق |
| menu.filter.countSingular | dish | طبق |
| menu.filter.countTwo | dishes | طبقان |
| menu.filter.gf | Gluten-free | بلا غلوتين |
| menu.filter.openDish | Details | التفاصيل |
| menu.filter.pescatarian | Pescatarian | نباتي مع السمك |
| menu.filter.vegan | Vegan | نباتي صرف |
| menu.filter.vegetarian | Vegetarian | نباتي |
| menu.h1 | Menu | القائمة |
| menu.labels.allergens | Allergens | مسببات الحساسية |
| menu.labels.signature | Signature | توقيع |
| menu.labels.soldOut | Sold out tonight | نفد لهذه الليلة |
| menu.notes.currency | Prices in SYP are indicative, converted at 12,500 SYP per USD and rounded to the nearest 500. USD prices are authoritative. | الأسعار بالليرة السورية استرشادية، محسوبة بسعر 12,500 ل.س للدولار وتُقرَّب لأقرب 500. الأسعار بالدولار هي المرجع. |
| menu.notes.halal | The kitchen is halal — no pork, no alcohol. | المطبخ حلال — لا لحم خنزير ولا كحول. |
| menu.sections | Menu sections | أقسام القائمة |
| meta.404.cta | Back to the ground floor | عد إلى الطابق الأرضي |
| meta.404.sub | The view you want is six floors up. | الإطلالة التي تريدها في الطابق السادس. |
| meta.404.title | This floor doesn't exist. | هذا الطابق غير موجود. |
| meta.error.reload | Reload | أعد التحميل |
| meta.error.sub | Something failed on our side. Reload — the city is still there. | خطأ من جهتنا. أعد التحميل — المدينة ما تزال هناك. |
| meta.error.title | The lights flickered. | ارتجّ الضوء لحظة. |
| meta.og.contact.desc | Find us on Abu Rummaneh Street, six floors up. | تجدنا في شارع أبو رمانة، في الطابق السادس. |
| meta.og.contact.title | Contact — MIRADOR | اتصل بنا — ميرادور |
| meta.og.description | Above the city, a table worth the climb. | فوق المدينة، مائدة تستحقّ الصعود. |
| meta.og.gallery.desc | Eight frames from a night above Damascus. | ثماني لقطات من ليلة فوق دمشق. |
| meta.og.gallery.title | The Gallery — MIRADOR | المعرض — ميرادور |
| meta.og.menu.desc | Twenty-eight dishes across six acts — fire, grain, and the city's amber. | ثمانية وعشرون طبقاً في ستة فصول — نار وحبوب وضوء المدينة. |
| meta.og.menu.title | The Menu — MIRADOR | القائمة — ميرادور |
| meta.og.private.desc | One room, one chef, your own night. | غرفة واحدة، طبّاخ واحد، وليلتك الخاصة. |
| meta.og.private.title | Private Dining — MIRADOR | الطاولة الخاصة — ميرادور |
| meta.og.reserve.desc | Dinner 18:00–22:30, Tuesday to Sunday. Twelve tables a night. | عشاء من 18:00 إلى 22:30، الثلاثاء إلى الأحد. اثنتا عشرة طاولة كل ليلة. |
| meta.og.reserve.title | Reserve a Table — MIRADOR | احجز طاولتك — ميرادور |
| meta.og.story.desc | Why MIRADOR climbs six floors. | لماذا يصعد ميرادور ستة طوابق. |
| meta.og.story.title | The Story — MIRADOR | الحكاية — ميرادور |
| meta.og.title | MIRADOR — Damascus | ميرادور — دمشق |
| nav.closeMenu | Close menu | أغلق القائمة |
| nav.contact | Contact | اتصل بنا |
| nav.cta | Reserve a table | احجز طاولتك |
| nav.gallery | Gallery | المعرض |
| nav.home | Home | الرئيسية |
| nav.localeSwitch | العربية | English |
| nav.menu | Menu | القائمة |
| nav.openMenu | Open menu | افتح القائمة |
| nav.privateDining | Private Dining | الطاولة الخاصة |
| nav.skip | Skip to content | تجاوز إلى المحتوى |
| nav.story | Story | الحكاية |
| private.h1 | Private Dining | الطاولة الخاصة |
| private.offerBody | The west end of the dining room detaches into a private table for twelve, with its own service and a standing menu from $65 per guest. For buyouts, tastings, and quiet celebrations, tell us the date — we will tell you what the kitchen can do. | تنفصل نهاية القاعة الغربية إلى مائدة خاصة لاثني عشر، بخدمة خاصة وقائمة ثابتة من 65$ للضيف. للحوازات الكاملة وجلسات التذوق والاحتفالات الهادئة، أخبرنا بالتاريخ — ونخبرك بما يستطيع المطبخ. |
| private.offerTitle | One room. Twelve seats. A private skyline. | قاعة. اثنا عشر مقعداً. إطلالة خاصة. |
| private.partyHint | Optional — 1 to 60 guests. | اختياري — من 1 إلى 60 ضيفاً. |
| private.success | Inquiry received. We reply within one business day — or reach us now on WhatsApp. | وصل استفسارك. نرد خلال يوم عمل واحد — أو تواصل معنا الآن عبر واتساب. |
| private.successReference | Reference | المرجع |
| private.whatsappCta | Reach us now on WhatsApp | تواصل معنا الآن عبر واتساب |
| reserve.date | Date | التاريخ |
| reserve.decreaseParty | Remove a guest | احذف ضيفاً |
| reserve.h1 | Reserve a table | احجز طاولتك |
| reserve.increaseParty | Add a guest | أضف ضيفاً |
| reserve.largePartyLink | Private dining | الطاولة الخاصة |
| reserve.largePartyNote | For parties above 12, the private dining room hosts up to twelve — tell us the date. | لأكثر من 12 ضيفاً، تستضيف الطاولة الخاصة حتى اثني عشر — أخبرنا بالتاريخ. |
| reserve.loadingSlots | Loading availability… | جارٍ تحميل الأوقات المتاحة… |
| reserve.name | Name | الاسم |
| reserve.partySize | Party size | عدد الضيوف |
| reserve.partyUnit | guests | ضيوف |
| reserve.phone | Phone | الهاتف |
| reserve.retry | Try again | أعد المحاولة |
| reserve.slotPast | Past | انتهى |
| reserve.slotSoldOut | Sold out | نفدت |
| reserve.submit | Reserve a table | احجز طاولتك |
| reserve.submitting | Reserving… | جارٍ الحجز… |
| reserve.tablesRemaining | tables | طاولات |
| reserve.time | Time | الوقت |
| story.ch1.body | There is no valet. There is a lift that takes its time, and a final flight of stairs where the noise of the street drops away with every step. By the last landing, the city is already below you — a field of small lights going about its evening. We chose the sixth floor for exactly this: the moment the doors open and the street turns into a view. | لا صفَّ سيارات ولا مضيفين عند الرصيف. يوجد مصعد يتمهّل، وسلالم أخيرة تسقط معها ضوضاء الشارع درجةً درجة. وعند آخر بلاطة تكون المدينة قد صارت تحتك: حقل أنوار صغيرة يعيش مساءه. اخترنا الطابق السادس لهذا بالذات: لحظة تنفتح فيها الأبواب ويتحول الشارع إلى إطلالة. |
| story.ch1.hud | CHAPTER ONE | الفصل الأول |
| story.ch1.title | The Climb | الصعود |
| story.ch2.body | One room, forty seats, a single long window facing west. Materials are few and honest: darkened oak, brushed brass, linen. Light comes from low amber sources, as if the room itself were lit by the city below. Nothing on the walls — the skyline is the art. | قاعة واحدة، أربعون مقعداً، ونافذة طويلة وحيدة تتجه غرباً. مواد قليلة وصادقة: سنديان معتّم، نحاس مصقول، كتان. الضوء يأتي من مصادر عنبرية منخفضة كأن القاعة مضاءة بالمدينة نفسها. لا شيء على الجدران — الأفق هو اللوحة. |
| story.ch2.hud | CHAPTER TWO | الفصل الثاني |
| story.ch2.title | The Room | القاعة |
| story.ch3.body | Service begins at six and ends when it ends. Courses leave the pass in their own order; the fire decides some of it. Ask for the ribeye for two and you will see why it needs the whole evening. | تبدأ الخدمة في السادسة وتنتهي حين تنتهي. تغادر الأطباق ممر المطبخ بترتيبها الخاص، والنار تقرر بعضه. اطلب الريباي لشخصين وسترى لماذا يحتاج المساء كله. |
| story.ch3.hud | CHAPTER THREE | الفصل الثالث |
| story.ch3.title | The Evening | المساء |
| story.h1 | Story | الحكاية |
| story.pullQuote | We kept only what the night required. | أبقينا فقط ما يحتاجه الليل. |
| whatsapp.general | Hello MIRADOR — I would like to ask about a table. | مرحباً ميرادور — أودّ الاستفسار عن مائدة. |
