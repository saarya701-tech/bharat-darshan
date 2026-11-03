export type Monument = {
  slug: string;
  name: string;
  hindi: string;
  city: string;
  state: string;
  region: string;
  category: string;
  period: string;
  unesco: boolean;
  coordinates: [number, number];
  image: string;
  description: string;
  history: string;
  architecture: string;
  officialUrl?: string;
};

export const monuments: Monument[] = [
  {
    slug: "taj-mahal", name: "Taj Mahal", hindi: "ताजमहल", city: "Agra", state: "Uttar Pradesh",
    region: "North", category: "Tomb", period: "17th century", unesco: true,
    coordinates: [78.0421, 27.1751], image: "/images/monuments/taj-mahal.jpg",
    description: "An ivory-white marble mausoleum on the banks of the Yamuna, celebrated for its symmetry and craftsmanship.",
    history: "Commissioned by Mughal emperor Shah Jahan and completed in the 17th century, the Taj Mahal is a major landmark of Mughal architecture.",
    architecture: "Its design combines Persian, Islamic and Indian influences, with a central dome, four minarets, gardens and intricate inlay work.",
    officialUrl: "https://whc.unesco.org/en/list/252/"
  },
  {
    slug: "agra-fort", name: "Agra Fort", hindi: "आगरा किला", city: "Agra", state: "Uttar Pradesh",
    region: "North", category: "Fort", period: "16th century onwards", unesco: true,
    coordinates: [78.0211, 27.1795], image: "/images/monuments/agra-fort.jpg",
    description: "A vast red sandstone fortress that served as a major Mughal imperial residence.",
    history: "The fort took its major Mughal form under Akbar in the 16th century and was later developed by his successors.",
    architecture: "Its complex combines massive defensive walls, audience halls, palaces, mosques and gardens.",
    officialUrl: "https://whc.unesco.org/en/list/251/"
  },
  {
    slug: "qutb-minar", name: "Qutb Minar", hindi: "कुतुब मीनार", city: "Delhi", state: "Delhi",
    region: "North", category: "Monument", period: "12th–14th centuries", unesco: true,
    coordinates: [77.1855, 28.5245], image: "/images/monuments/qutb-minar.jpg",
    description: "A soaring fluted sandstone minaret within the Qutb complex in Delhi.",
    history: "Construction began under Qutb al-Din Aibak around 1199 and continued under later rulers.",
    architecture: "The tapering tower has projecting balconies, inscriptions and alternating angular and rounded fluting.",
    officialUrl: "https://whc.unesco.org/en/list/233/"
  },
  {
    slug: "humayuns-tomb", name: "Humayun's Tomb", hindi: "हुमायूँ का मकबरा", city: "Delhi", state: "Delhi",
    region: "North", category: "Tomb", period: "16th century", unesco: true,
    coordinates: [77.2507, 28.5933], image: "/images/monuments/humayuns-tomb.jpg",
    description: "A garden-tomb whose monumental form influenced later Mughal architecture.",
    history: "Commissioned by Haji Begum for Mughal emperor Humayun and completed in the 16th century.",
    architecture: "The tomb combines a high central dome, red sandstone, white marble and a charbagh garden layout.",
    officialUrl: "https://whc.unesco.org/en/list/232/"
  },
  {
    slug: "red-fort", name: "Red Fort", hindi: "लाल किला", city: "Delhi", state: "Delhi",
    region: "North", category: "Fort", period: "17th century", unesco: true,
    coordinates: [77.2410, 28.6562], image: "/images/monuments/red-fort.jpg",
    description: "A monumental Mughal fort complex built along the Yamuna in Old Delhi.",
    history: "Emperor Shah Jahan commissioned the fort as the palace-fortress of his new capital, Shahjahanabad.",
    architecture: "Its red sandstone ramparts enclose palaces, audience halls, gardens and ceremonial gateways.",
    officialUrl: "https://whc.unesco.org/en/list/231/"
  },
  {
    slug: "khajuraho-temples", name: "Khajuraho Group of Monuments", hindi: "खजुराहो मंदिर समूह", city: "Khajuraho", state: "Madhya Pradesh",
    region: "Central", category: "Temple", period: "10th–11th centuries", unesco: true,
    coordinates: [79.9199, 24.8318], image: "/images/monuments/khajuraho-temples.jpg",
    description: "A celebrated group of temples known for intricate stone sculpture and finely proportioned architecture.",
    history: "Most surviving temples were built by the Chandela dynasty between the 10th and 11th centuries.",
    architecture: "The temples feature elevated platforms, mandapas, soaring shikharas and richly carved sculptural bands.",
    officialUrl: "https://whc.unesco.org/en/list/240/"
  },
  {
    slug: "hawa-mahal", name: "Hawa Mahal", hindi: "हवा महल", city: "Jaipur", state: "Rajasthan",
    region: "West", category: "Palace", period: "18th century", unesco: false,
    coordinates: [75.8267, 26.9239], image: "/images/monuments/hawa-mahal.jpg",
    description: "Jaipur's iconic Palace of Winds, known for its honeycomb façade and small windows.",
    history: "Built in 1799 during the reign of Maharaja Sawai Pratap Singh, Hawa Mahal formed part of the City Palace complex.",
    architecture: "The five-storey façade uses jharokhas and screened windows to encourage airflow.",
    officialUrl: "https://www.tourism.rajasthan.gov.in/"
  },
  {
    slug: "amber-fort", name: "Amber Fort", hindi: "आमेर किला", city: "Amer, Jaipur", state: "Rajasthan",
    region: "West", category: "Fort", period: "16th century onwards", unesco: true,
    coordinates: [75.8513, 26.9855], image: "/images/monuments/amber-fort.jpg",
    description: "A hilltop fort-palace overlooking Maota Lake, known for its courtyards and ornate halls.",
    history: "The complex was developed by the Kachwaha rulers, with major construction under Raja Man Singh I.",
    architecture: "Its Rajput palace design blends defensive fortifications with decorated halls, mirrored interiors and gardens.",
    officialUrl: "https://whc.unesco.org/en/list/247/"
  },
  {
    slug: "chittorgarh-fort", name: "Chittorgarh Fort", hindi: "चित्तौड़गढ़ दुर्ग", city: "Chittorgarh", state: "Rajasthan",
    region: "West", category: "Fort", period: "Early medieval period onwards", unesco: true,
    coordinates: [74.6450, 24.8879], image: "/images/monuments/chittorgarh-fort.jpg",
    description: "A sprawling hill fort associated with the history and traditions of Mewar.",
    history: "Chittorgarh served as a major stronghold of the Mewar kingdom and witnessed several sieges.",
    architecture: "The fort contains gateways, palaces, temples, reservoirs and prominent towers across a fortified plateau.",
    officialUrl: "https://whc.unesco.org/en/list/247/"
  },
  {
    slug: "rani-ki-vav", name: "Rani ki Vav", hindi: "रानी की वाव", city: "Patan", state: "Gujarat",
    region: "West", category: "Stepwell", period: "11th century", unesco: true,
    coordinates: [72.1017, 23.8589], image: "/images/monuments/rani-ki-vav.jpg",
    description: "An elaborate stepwell distinguished by sculptural galleries and subterranean architecture.",
    history: "Rani ki Vav is generally dated to the 11th century and is associated with the Solanki period.",
    architecture: "The stepwell is arranged as an inverted temple, with multiple levels, pillared pavilions and extensive sculptural decoration.",
    officialUrl: "https://whc.unesco.org/en/list/922/"
  },
  {
    slug: "modhera-sun-temple", name: "Modhera Sun Temple", hindi: "मोढेरा सूर्य मंदिर", city: "Modhera", state: "Gujarat",
    region: "West", category: "Temple", period: "11th century", unesco: false,
    coordinates: [72.1362, 23.5830], image: "/images/monuments/modhera-sun-temple.jpg",
    description: "A Solanki-era temple dedicated to the Sun, set beside a monumental stepped tank.",
    history: "The temple was built in the early 11th century during the reign of Bhima I of the Chaulukya dynasty.",
    architecture: "Its complex includes the Surya Kund, Sabha Mandapa and Gudha Mandapa, aligned along an east-west axis.",
    officialUrl: "https://asi.nic.in/"
  },
  {
    slug: "ajanta-caves", name: "Ajanta Caves", hindi: "अजंता की गुफाएँ", city: "Aurangabad", state: "Maharashtra",
    region: "West", category: "Cave", period: "2nd century BCE–6th century CE", unesco: true,
    coordinates: [75.7033, 20.5519], image: "/images/monuments/ajanta-caves.jpg",
    description: "Rock-cut Buddhist caves celebrated for murals, sculptures and monastic architecture.",
    history: "The caves were excavated in two major phases, beginning around the 2nd century BCE and flourishing again in the 5th century CE.",
    architecture: "The complex includes chaityas and viharas carved into a horseshoe-shaped cliff above the Waghora River.",
    officialUrl: "https://whc.unesco.org/en/list/242/"
  },
  {
    slug: "brihadeeswarar-temple", name: "Brihadeeswarar Temple", hindi: "बृहदीश्वर मंदिर", city: "Thanjavur", state: "Tamil Nadu",
    region: "South", category: "Temple", period: "11th century", unesco: true,
    coordinates: [79.1318, 10.7828], image: "/images/monuments/brihadeeswarar-temple.jpg",
    description: "A monumental Chola-era temple renowned for its towering vimana.",
    history: "Commissioned by Chola ruler Rajaraja I and consecrated in the early 11th century.",
    architecture: "The granite temple is a landmark of Dravidian architecture.",
    officialUrl: "https://whc.unesco.org/en/list/250/"
  },
  {
    slug: "meenakshi-temple", name: "Meenakshi Amman Temple", hindi: "मीनाक्षी अम्मन मंदिर", city: "Madurai", state: "Tamil Nadu",
    region: "South", category: "Temple", period: "Major expansion 16th–17th centuries", unesco: false,
    coordinates: [78.1198, 9.9195], image: "/images/monuments/meenakshi-temple.jpg",
    description: "A major temple complex in Madurai, famed for its sculpted gateway towers.",
    history: "The temple has ancient roots and received major rebuilding and expansion under the Nayak rulers.",
    architecture: "Its complex features towering gopurams, pillared halls, shrines and richly ornamented corridors.",
    officialUrl: "https://maduraimeenakshi.hrce.tn.gov.in/"
  },
  {
    slug: "mysore-palace", name: "Mysore Palace", hindi: "मैसूर महल", city: "Mysuru", state: "Karnataka",
    region: "South", category: "Palace", period: "Early 20th century", unesco: false,
    coordinates: [76.6551, 12.3052], image: "/images/monuments/mysore-palace.jpg",
    description: "The ceremonial palace of the Wadiyar dynasty and a landmark of Mysuru.",
    history: "The present palace was completed in 1912 after the earlier wooden palace was destroyed by fire.",
    architecture: "The Indo-Saracenic design combines domes, arches, towers and richly decorated interiors.",
    officialUrl: "https://mysorepalace.karnataka.gov.in/"
  },
  {
    slug: "hampi", name: "Group of Monuments at Hampi", hindi: "हम्पी के स्मारक", city: "Hampi", state: "Karnataka",
    region: "South", category: "Temple", period: "14th–16th centuries", unesco: true,
    coordinates: [76.4600, 15.3350], image: "/images/monuments/hampi.jpg",
    description: "The remains of Vijayanagara's capital, set among a dramatic landscape of boulders and river valleys.",
    history: "Hampi flourished as the capital of the Vijayanagara Empire, especially between the 14th and 16th centuries.",
    architecture: "Its landscape contains temples, bazaars, royal enclosures, water structures and monumental stone architecture.",
    officialUrl: "https://whc.unesco.org/en/list/241/"
  },
  {
    slug: "charminar", name: "Charminar", hindi: "चारमीनार", city: "Hyderabad", state: "Telangana",
    region: "South", category: "Monument", period: "16th century", unesco: false,
    coordinates: [78.4747, 17.3616], image: "/images/monuments/charminar.jpg",
    description: "Hyderabad's landmark four-minaret structure at the historic centre of the old city.",
    history: "Muhammad Quli Qutb Shah commissioned Charminar in 1591 as a defining monument of the new city.",
    architecture: "The square structure has four grand arches and four minarets rising from its corners.",
    officialUrl: "https://www.telangana.gov.in/"
  },
  {
    slug: "shore-temple", name: "Shore Temple", hindi: "शोर मंदिर", city: "Mahabalipuram", state: "Tamil Nadu",
    region: "South", category: "Temple", period: "8th century", unesco: true,
    coordinates: [80.1944, 12.6161], image: "/images/monuments/shore-temple.jpg",
    description: "A granite temple complex overlooking the Bay of Bengal at Mahabalipuram.",
    history: "The Shore Temple was built during the Pallava period, commonly associated with Narasimhavarman II.",
    architecture: "Its compact Dravidian shrines are arranged close to the shoreline and feature tiered pyramidal towers.",
    officialUrl: "https://whc.unesco.org/en/list/249/"
  },
  {
    slug: "konark-sun-temple", name: "Konark Sun Temple", hindi: "कोणार्क सूर्य मंदिर", city: "Konark", state: "Odisha",
    region: "East", category: "Temple", period: "13th century", unesco: true,
    coordinates: [86.0945, 19.8876], image: "/images/monuments/konark-sun-temple.jpg",
    description: "A monumental temple conceived as the stone chariot of the Sun God.",
    history: "The temple was built in the 13th century under the Eastern Ganga dynasty.",
    architecture: "Its chariot form features carved stone wheels and horses.",
    officialUrl: "https://whc.unesco.org/en/list/246/"
  },
  {
    slug: "sanchi-stupa", name: "Sanchi Stupa", hindi: "सांची स्तूप", city: "Sanchi", state: "Madhya Pradesh",
    region: "Central", category: "Buddhist Site", period: "3rd century BCE onwards", unesco: true,
    coordinates: [77.7397, 23.4793], image: "/images/monuments/sanchi-stupa.jpg",
    description: "A major Buddhist complex known for its stupa, gateways and centuries of architectural development.",
    history: "The earliest monument at Sanchi is associated with Emperor Ashoka in the 3rd century BCE.",
    architecture: "The Great Stupa is surrounded by stone railings and carved toranas.",
    officialUrl: "https://whc.unesco.org/en/list/524/"
  },
  {
    slug: "victoria-memorial", name: "Victoria Memorial", hindi: "विक्टोरिया मेमोरियल", city: "Kolkata", state: "West Bengal",
    region: "East", category: "Memorial", period: "Early 20th century", unesco: false,
    coordinates: [88.3426, 22.5448], image: "/images/monuments/victoria-memorial.jpg",
    description: "A monumental white-marble memorial and museum set within landscaped gardens.",
    history: "The memorial was conceived after Queen Victoria's death and opened to the public in 1921.",
    architecture: "Its design blends British, Mughal and other Indo-Saracenic influences, crowned by a bronze angel.",
    officialUrl: "https://victoriamemorial-cal.org/"
  },
  {
    slug: "nalanda-mahavihara", name: "Nalanda Mahavihara", hindi: "नालंदा महाविहार", city: "Nalanda", state: "Bihar",
    region: "East", category: "Buddhist Site", period: "5th–13th centuries", unesco: true,
    coordinates: [85.4439, 25.1357], image: "/images/monuments/nalanda-mahavihara.jpg",
    description: "The archaeological remains of a renowned ancient centre of Buddhist learning.",
    history: "Nalanda developed into a major monastic and scholastic institution from the 5th century CE.",
    architecture: "The excavated complex includes monasteries, shrines, stupas and extensive brick structures.",
    officialUrl: "https://whc.unesco.org/en/list/1502/"
  },
  {
    slug: "fatehpur-sikri", name: "Fatehpur Sikri", hindi: "फतेहपुर सीकरी", city: "Fatehpur Sikri", state: "Uttar Pradesh",
    region: "North", category: "Palace", period: "16th century", unesco: true,
    coordinates: [77.6650, 27.0945], image: "/images/monuments/fatehpur-sikri.jpg",
    description: "A planned Mughal imperial city with palaces, courtyards, mosques and monumental gateways.",
    history: "Emperor Akbar established Fatehpur Sikri as his capital in the late 16th century.",
    architecture: "The red sandstone complex combines Persianate planning with regional building traditions.",
    officialUrl: "https://whc.unesco.org/en/list/255/"
  },
  {
    slug: "gol-gumbaz", name: "Gol Gumbaz", hindi: "गोल गुम्बज़", city: "Vijayapura", state: "Karnataka",
    region: "South", category: "Tomb", period: "17th century", unesco: false,
    coordinates: [75.40, 16.8302], image: "/images/monuments/gol-gumbaz.jpg",
    description: "The mausoleum of Mohammed Adil Shah, famous for its immense dome and whispering gallery.",
    history: "Gol Gumbaz was built in the 17th century as the tomb of the Adil Shahi ruler Mohammed Adil Shah.",
    architecture: "Its vast dome rests on intersecting arches and pendentives, with a celebrated gallery around the interior.",
    officialUrl: "https://asi.nic.in/"
  },
  {
    slug: "ellora-caves", name: "Ellora Caves", hindi: "एलोरा की गुफाएँ", city: "Aurangabad", state: "Maharashtra",
    region: "West", category: "Cave", period: "6th–10th centuries", unesco: true,
    coordinates: [75.1793, 20.0268], image: "/images/monuments/ellora-caves.jpg",
    description: "A remarkable group of Buddhist, Hindu and Jain rock-cut monuments.",
    history: "The caves were created over several centuries, reflecting changing religious and artistic traditions.",
    architecture: "The site includes monasteries, temples and the monumental Kailasa temple carved from a single rock mass.",
    officialUrl: "https://whc.unesco.org/en/list/243/"
  }
];

export const categories = ["Fort", "Temple", "Stepwell", "Cave", "Tomb", "Palace", "Buddhist Site", "Monument", "Memorial"];
export const regions = ["North", "South", "East", "West", "Central"];
