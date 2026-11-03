export interface ProvinceData {
  id: string;
  name: string;
  districts: {
    name: string;
    municipalities: string[];
  }[];
}

export const NEPAL_LOCATION_DATA: ProvinceData[] = [
  {
    id: "bagmati",
    name: "Bagmati Province",
    districts: [
      {
        name: "Kathmandu",
        municipalities: [
          "Kathmandu Metropolitan City",
          "Kirtipur Municipality",
          "Budhanilkantha Municipality",
          "Tokha Municipality",
          "Chandragiri Municipality",
          "Tarakeshwar Municipality",
          "Nagarjun Municipality",
          "Gokarneshwar Municipality",
          "Dakshinkali Municipality",
          "Shankharapur Municipality",
        ],
      },
      {
        name: "Lalitpur",
        municipalities: [
          "Lalitpur Metropolitan City",
          "Mahalaxmi Municipality",
          "Godawari Municipality",
          "Konjyoson Rural Municipality",
        ],
      },
      {
        name: "Bhaktapur",
        municipalities: [
          "Bhaktapur Municipality",
          "Madhyapur Thimi Municipality",
          "Suryabinayak Municipality",
          "Changunarayan Municipality",
        ],
      },
      {
        name: "Chitwan",
        municipalities: [
          "Bharatpur Metropolitan City",
          "Ratnanagar Municipality",
          "Khairahani Municipality",
          "Rapti Municipality",
          "Kalika Municipality",
          "Madi Municipality",
        ],
      },
      {
        name: "Makwanpur",
        municipalities: ["Hetauda Sub-Metropolitan City", "Thaha Municipality"],
      },
      {
        name: "Kavrepalanchok",
        municipalities: ["Banepa Municipality", "Dhulikhel Municipality", "Panauti Municipality"],
      },
    ],
  },
  {
    id: "gandaki",
    name: "Gandaki Province",
    districts: [
      {
        name: "Kaski",
        municipalities: ["Pokhara Metropolitan City", "Annapurna Rural Municipality"],
      },
      {
        name: "Tanahun",
        municipalities: ["Vyas Municipality", "Shuklagandaki Municipality", "Bhanu Municipality"],
      },
      {
        name: "Nawalpur",
        municipalities: ["Kawasoti Municipality", "Gaindakot Municipality", "Devchuli Municipality"],
      },
    ],
  },
  {
    id: "koshi",
    name: "Koshi Province",
    districts: [
      {
        name: "Morang",
        municipalities: [
          "Biratnagar Metropolitan City",
          "Sundarharaicha Municipality",
          "Belbari Municipality",
          "Urlabari Municipality",
        ],
      },
      {
        name: "Sunsari",
        municipalities: [
          "Dharan Sub-Metropolitan City",
          "Itahari Sub-Metropolitan City",
          "Inaruwa Municipality",
        ],
      },
      {
        name: "Jhapa",
        municipalities: ["Birtamod Municipality", "Damak Municipality", "Mechinagar Municipality", "Bhadrapur Municipality"],
      },
    ],
  },
  {
    id: "madhesh",
    name: "Madhesh Province",
    districts: [
      {
        name: "Parsa",
        municipalities: ["Birgunj Metropolitan City", "Pokhariya Municipality"],
      },
      {
        name: "Dhanusha",
        municipalities: ["Janakpurdham Sub-Metropolitan City", "Mithila Municipality"],
      },
      {
        name: "Bara",
        municipalities: ["Jitpur Simara Sub-Metropolitan City", "Kalaiya Sub-Metropolitan City"],
      },
    ],
  },
  {
    id: "lumbini",
    name: "Lumbini Province",
    districts: [
      {
        name: "Rupandehi",
        municipalities: ["Butwal Sub-Metropolitan City", "Siddharthanagar (Bhairahawa) Municipality", "Tilottama Municipality"],
      },
      {
        name: "Dang",
        municipalities: ["Ghorahi Sub-Metropolitan City", "Tulsipur Sub-Metropolitan City"],
      },
      {
        name: "Banke",
        municipalities: ["Nepalgunj Sub-Metropolitan City", "Kohalpur Municipality"],
      },
    ],
  },
  {
    id: "karnali",
    name: "Karnali Province",
    districts: [
      {
        name: "Surkhet",
        municipalities: ["Birendranagar Municipality", "Bheriganga Municipality"],
      },
    ],
  },
  {
    id: "sudurpashchim",
    name: "Sudurpashchim Province",
    districts: [
      {
        name: "Kailali",
        municipalities: ["Dhangadhi Sub-Metropolitan City", "Tikapur Municipality", "Godawari Municipality"],
      },
      {
        name: "Kanchanpur",
        municipalities: ["Bhimdatta (Mahendranagar) Municipality", "Bedkot Municipality"],
      },
    ],
  },
];

export const POPULAR_LOCATIONS = [
  "Kathmandu Valley (KTM/LAL/BKT)",
  "Pokhara, Kaski",
  "Biratnagar, Morang",
  "Birgunj, Parsa",
  "Butwal & Bhairahawa, Rupandehi",
  "Narayangarh & Bharatpur, Chitwan",
  "Nepalgunj, Banke",
  "Dhangadhi, Kailali",
  "Itahari & Dharan, Sunsari",
];
