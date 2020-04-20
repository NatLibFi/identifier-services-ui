/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * UI microservice of Identifier Services
 *
 * Copyright (C) 2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-ui
 *
 * identifier-services-ui program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * identifier-services-ui is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */
export const classificationCodes = [
	{label: '000 General', value: 0},
	{label: '015 Book business, Libraries', value: 15},
	{label: '030 Text books', value: 30},
	{label: '035 Children\'s books', value: 35},
	{label: '040 Official publications', value: 40},
	{label: '045 University publications', value: 45},
	{label: '050 Electroinc publications', value: 50},
	{label: '055 Audiovisual material. Videos', value: 55},
	{label: '100 Philosophy', value: 100},
	{label: '120 Psychology', value: 120},
	{label: '130 Paranormal phenomena, Occultism, Astrology', value: 130},
	{label: '200 Religion, Theology', value: 200},
	{label: '210 Christianity', value: 210},
	{label: '211 The Orthodox Church', value: 211},
	{label: '270 Other religions', value: 270},
	{label: '300 Social Science, Sociology', value: 300},
	{label: '310 Political Studies, International Politics', value: 310},
	{label: '310 Military Science', value: 310},
	{label: '316 Sociology', value: 316},
	{label: '320 Economics', value: 320},
	{label: '330 Law', value: 330},
	{label: '340 Public administration', value: 340},
	{label: '350 Education', value: 350},
	{label: '370 Ethnography, Folklore', value: 370},
	{label: '380 Social Politics, Welfare', value: 380},
	{label: '390 Mass Media', value: 390},
	{label: '400 Literature research', value: 400},
	{label: '410 Fiction', value: 410},
	{label: '420 Poetry', value: 420},
	{label: '440 Cartoons', value: 440},
	{label: '450 Science Fiction', value: 450},
	{label: '460 Crime Fiction', value: 460},
	{label: '470 Linguistic', value: 470},
	{label: '480 Sexual Minorities', value: 480},
	{label: '490 Minorities', value: 490},
	{label: '500 Science', value: 500},
	{label: '510 Mathematics, Statistics', value: 510},
	{label: '520 Astronomy', value: 520},
	{label: '530 Physics', value: 530},
	{label: '540 Chemistry', value: 540},
	{label: '550 Geology', value: 550},
	{label: '560 Biology', value: 560},
	{label: '570 Zoology', value: 570},
	{label: '580 Botany', value: 580},
	{label: '590 Environmental Studies, Conservation', value: 590},
	{label: '600 Technology', value: 600},
	{label: '610 Engineering Technology', value: 610},
	{label: '620 Industry', value: 620},
	{label: '621 Construction', value: 621},
	{label: '622 Transport, Post', value: 622},
	{label: '630 Information Technology', value: 630},
	{label: '640 Medicine, Psychiatry', value: 640},
	{label: '650 Odontology', value: 650},
	{label: '660 Veterinary Medicine', value: 660},
	{label: '670 Pharmacology, Homeopathy', value: 670},
	{label: '672 Forestry', value: 672},
	{label: '680 Agriculture', value: 680},
	{label: '690 Handicraft', value: 690},
	{label: '700 Art', value: 700},
	{label: '710 Performing Art', value: 710},
	{label: '720 Theatre, Film', value: 720},
	{label: '730 Dance', value: 730},
	{label: '740 Visual Arts', value: 740},
	{label: '750 Art History', value: 750},
	{label: '760 Architecture, Industrial Art', value: 760},
	{label: '765 Fashion', value: 765},
	{label: '770 Music', value: 770},
	{label: '780 Antiques, Collecting', value: 780},
	{label: '790 City and Regional Planning', value: 790},
	{label: '800 Leisure and Hobbies', value: 800},
	{label: '810 Sports', value: 810},
	{label: '820 Games', value: 820},
	{label: '830 Hunting and Fishing', value: 830},
	{label: '840 Gardening', value: 840},
	{label: '850 Home Economics', value: 850},
	{label: '860 Health and Beauty', value: 860},
	{label: '870 Photography', value: 870},
	{label: '880 Tourism, Travel', value: 880},
	{label: '890 Humour', value: 890},
	{label: '900 History', value: 900},
	{label: '910 Geography', value: 910},
	{label: '920 Maps and Atlases', value: 920},
	{label: '930 Archeology', value: 930},
	{label: '940 Genealogy', value: 940},
	{label: '950 Numismatics', value: 950}
];

export const fieldArray = [
	{
		basicInformation: [
			{
				name: 'name',
				type: 'text',
				label: 'Name*',
				width: 'half'
			},
			{
				name: 'postalAddress[address]',
				type: 'text',
				label: 'Address*',
				width: 'half'
			},
			{
				name: 'postalAddress[addressDetails]',
				type: 'text',
				label: 'Address Details',
				width: 'half'
			},
			{
				name: 'postalAddress[city]',
				type: 'text',
				label: 'City*',
				width: 'half'
			},
			{
				name: 'postalAddress[zip]',
				type: 'text',
				label: 'Zip*',
				width: 'half'
			},
			{
				name: 'publisherEmail',
				type: 'text',
				label: 'Publisher Email*',
				width: 'half'
			},
			{
				name: 'phone',
				type: 'text',
				label: 'Phone*',
				width: 'half'
			},
			{
				name: 'website',
				type: 'text',
				label: 'Website',
				width: 'half'
			},
			{
				name: 'language',
				type: 'select',
				label: 'Select Language',
				width: 'half',
				defaultValue: 'eng',
				options: [
					{label: 'English (Default Language)', value: 'eng'},
					{label: 'Suomi', value: 'fin'},
					{label: 'Svenska', value: 'swe'}
				]
			},
			{
				name: 'postalAddress[public]',
				type: 'checkbox',
				label: 'Public',
				width: 'half',
				info: 'Check to make your postal address available to public.'
			}
		]
	},
	{
		publishingActivities: [
			{
				name: 'code',
				type: 'text',
				label: 'Code',
				width: 'half'
			},
			{
				name: 'publicationDetails[frequency]',
				type: 'text',
				label: 'Publication Estimate*',
				width: 'half'
			},
			{
				name: 'aliases',
				type: 'arrayString',
				label: 'Aliases',
				width: 'half',
				subName: 'alias'
			},
			{
				name: 'classification',
				type: 'multiSelect',
				label: 'Classification*',
				options: classificationCodes,
				width: 'half'
			}
		]
	},
	{
		primaryContact: [
			{
				name: 'givenName',
				type: 'text',
				label: 'Given Name',
				width: 'full'
			},
			{
				name: 'familyName',
				type: 'text',
				label: 'Family Name',
				width: 'full'
			},
			{
				name: 'email',
				type: 'email',
				label: 'Email*',
				width: 'full'
			}

		]
	},
	{
		organizationalDetails1: [
			{
				title: 'AffiliateOf',
				fields: [
					{
						name: 'affiliateOf[affiliateOfAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}

				]
			},
			{
				title: 'Affiliates',
				fields: [
					{
						name: 'affiliatesAddress',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'affiliatesAddressDetails',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'affiliatesCity',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'affiliatesZip',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'affiliatesName',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			}
		]
	},
	{
		organizationalDetails2: [
			{
				title: 'DistributorOf',
				fields: [
					{
						name: 'distributorOf[distributorOfAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			},
			{
				title: 'Distributor',
				fields: [
					{
						name: 'distributor[distributorAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'distributor[distributorAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'distributor[distributorCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'distributor[distributorZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'distributor[distributorName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			}

		]
	},
	{
		review: 'review'
	}
];
