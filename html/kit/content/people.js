/*
 * kit/content/people.js: person names, usernames, email addresses, job titles, departments, phone numbers.
 * API: see the header of kit/content/core.js.
 */
(function () {
  'use strict';
  const C = env.content;
  const L = C.lines;

  const g = (origin, first, last) => ({ origin, first: L(first), last: L(last) });

  const NAME_GROUPS = [
    g('english', `
      James
      Olivia
      Liam
      Emma
      Noah
      Charlotte
      Ethan
      Amelia
      Benjamin
      Harper
      Lucas
      Evelyn
      Henry
      Abigail
      Jack
      Emily
      Owen
      Grace
      Samuel
      Chloe
      Daniel
      Hannah
      Matthew
      Lily
      Nathan
      Megan
      Connor
      Sophie
      Rebecca
      Thomas
      Ella
      Michael
      Avery
      William
      Scarlett
      Zoe
      David
      Victoria
      Joseph
      Madison
      Andrew
      Natalie
      Addison
      Joshua
      Stella
      Ryan
      Claire
      Anthony
      Audrey
      Jonathan
      Brooklyn
      Dylan
      Sarah
      Gabriel
      Lucy
      Isaac
      Lauren
      Caleb
      Peter
      Isabella
      Logan
      Mia
      Charles
      Mason
      Georgia
      Eleanor
      Julian
      Ruby
      Adam
      Alice
      Leo
      Julia
      Aaron
      Leah
      Cameron
      Anna
      Zachary
      Violet
      Luke
      Jasmine
      Elliot
      Maria
      Patrick
      Daisy
      Oscar
      Molly
      Evan
      Jacob
      Jennifer
      Jessica
      Brian
      Kevin
      Mark
      Steven
      Paul
      George
      Edward
      Robert
      Richard
      Amanda
      Nicole
      Kimberly
      Melissa
      Heather
      Amy
      Angela
      Michelle
      Lisa
      Karen
      Patricia
      Susan
      Donna
      Cynthia
      Timothy
      Eric
      Oliver
      Sophia
      Elijah
      Nora
      Aria
      Wyatt
      Penelope
      Levi
      Hazel
      Miles
      Ezra
      Asher
      Wesley
      Clara
      Vera
      Ivy
      Lillian
      Landon
      Theo
      Ellie
      Eli
      Ezekiel
      Bennett
      Caroline
      Sadie
      Cora
      Everett
      Samantha
    `, `
      Smith
      Johnson
      Williams
      Brown
      Taylor
      Anderson
      Thompson
      White
      Harris
      Clarke
      Walker
      Wright
      Robinson
      Hughes
      Edwards
      Turner
      Carter
      Mitchell
      Parker
      Collins
      Bennett
      Foster
      Hayes
      Sullivan
      Brooks
      Ward
      Price
      Reed
      Fletcher
      Greenwood
      Evans
      Jackson
      Wilson
      Wood
      James
      Simpson
      Ellis
      Baker
      Morris
      Morgan
      Gray
      Bell
      Cox
      Marsh
      Chapman
      Bailey
      Shaw
      Mason
      Palmer
      Webb
      Russell
      Dixon
      Knight
      Spencer
      Lawson
      Gibson
      Hunt
      Holmes
      Harvey
      Fisher
      Adams
      Allen
      Atkinson
      Austin
      Barber
      Barnes
      Barrett
      Bates
      Bishop
      Bradley
      Burton
      Campbell
      Cole
      Cook
      Cooper
      Cross
      Davies
      Dean
      Dunn
      Elliott
      Ferguson
      Ford
      Fox
      Freeman
      Fuller
      Gardner
      Gordon
      Graham
      Grant
      Hall
      Abbott
      Arnold
      Atwood
      Avery
      Banks
      Barker
      Beck
      Berry
      Black
      Bond
      Booth
      Bowen
      Briggs
      Bright
      Buckley
      Burke
      Burns
      Caldwell
      Carey
      Chambers
      Chandler
      Chase
      Church
      Clayton
      Cobb
      Conway
      Curtis
      Dale
      Dalton
      Andrews
      Archer
      Baxter
      Benson
      Bradshaw
      Brock
      Butler
      Dawson
      Drake
      Dyer
      Eaton
      Fowler
      Goodwin
      Hammond
      Hardy
      Harrison
      Hawkins
      Holland
      Hudson
      Ingram
      Jarvis
      Jennings
      Kendall
      Marshall
      Nash
      Norton
      Osborne
      Saunders
      Woodward
    `),
    g('hispanic', `
      Mateo
      Sofía
      Santiago
      Valentina
      Diego
      Camila
      Alejandro
      Lucía
      Javier
      Isabella
      Andrés
      Mariana
      Carlos
      Daniela
      Pablo
      Gabriela
      Miguel
      Ximena
      Emilio
      Paula
      Rafael
      Fernanda
      José
      Juan
      Martín
      Nicolás
      Adrián
      Tomás
      Joaquín
      Sebastián
      Héctor
      Ángel
      Valeria
      Elena
      Renata
      Carmen
      Natalia
      Carolina
      Julieta
      Inés
      Teresa
      Rocío
      Claudia
      Verónica
      Luis
      Fernando
      Ricardo
      Manuel
      Francisco
      Antonio
      Eduardo
      Sergio
      Ramón
      Óscar
      Vicente
      Esteban
      Lorenzo
      Ignacio
      María
      Laura
      Sara
      Silvia
      Pilar
      Mónica
      Josefina
      Abril
      Aitana
      Alma
      Amalia
      Berenice
      Catalina
      Celeste
      Dalia
      Dolores
      Elisa
      Estrella
      Guadalupe
      Lourdes
      Marisol
      Paloma
      Soledad
      Yadira
      Fabián
      Gael
      Iván
      Bruno
      Cristian
      Alfonso
      Álvaro
      Armando
      Arturo
      César
      Enrique
      Ernesto
      Felipe
      Guillermo
      Hugo
      Jaime
      Jorge
      Mario
      Mauricio
      Alejandra
      Beatriz
      Irene
      Julia
      Lidia
      Lorena
      Mercedes
      Raquel
    `, `
      García
      Rodríguez
      Martínez
      Hernández
      López
      González
      Pérez
      Sánchez
      Ramírez
      Torres
      Flores
      Rivera
      Gómez
      Díaz
      Morales
      Ortiz
      Castillo
      Vargas
      Romero
      Navarro
      Herrera
      Mendoza
      Cruz
      Reyes
      Aguilar
      Ríos
      Medina
      Castro
      Silva
      Vega
      Fuentes
      Cabrera
      Rojas
      Campos
      Guerrero
      Salazar
      Soto
      Valdez
      Núñez
      Peña
      Pacheco
      Carrillo
      León
      Espinoza
      Jiménez
      Álvarez
      Domínguez
      Vásquez
      Ramos
      Molina
      Delgado
      Suárez
      Fernández
      Benítez
      Acosta
      Ochoa
      Méndez
      Arias
      Sandoval
      Ibarra
      Miranda
      Maldonado
      Escobar
      Paredes
      Cárdenas
      Chávez
      Contreras
      Luna
      Alvarado
      Rivas
      Castañeda
      Serrano
      Ponce
      Figueroa
      Robles
      Salinas
      Valencia
      Cordero
      Palacios
      Solís
      Gallegos
      Zamora
      Tapia
      Toledo
      Cisneros
      Montoya
      Márquez
      Ortega
      Marín
      Cortés
      Santos
      Lozano
      Aguilera
      Pizarro
      Sepúlveda
      Ceballos
      Bravo
      Guerra
      Rosales
      Durán
      Solano
      Peralta
      Treviño
      Beltrán
      Escamilla
      Palomares
      Aparicio
    `),
    g('brazilian', `
      João
      Ana
      Pedro
      Beatriz
      Gabriel
      Larissa
      Thiago
      Juliana
      Felipe
      Letícia
      Gustavo
      Carolina
      Rodrigo
      Bruna
      Vinícius
      Aline
      Rafael
      Mariana
      Eduardo
      Isabela
      André
      Camila
      Henrique
      Fernanda
      Leonardo
      Gabriela
      Daniel
      Vitória
      Marcelo
      Sofia
      Bruno
      Natália
      Maria
      José
      Lucas
      Matheus
      Júlia
      Luana
      Diego
      Caio
      Igor
      Miguel
      Arthur
      Davi
      Laura
      Alice
      Manuela
      Isadora
      Antônio
      Paulo
      Carlos
      Marcos
      Vitor
      Bernardo
      Heitor
      Samuel
      Helena
      Heloísa
      Cecília
      Lorena
      Melissa
      Adriana
      Amanda
      Bianca
      Débora
      Eliane
      Fabiana
      Fábio
      Fernando
      Flávia
      Jéssica
      Leandro
      Márcia
      Murilo
      Patrícia
      Renato
      Yasmin
    `, `
      Silva
      Santos
      Oliveira
      Souza
      Costa
      Pereira
      Almeida
      Carvalho
      Ribeiro
      Ferreira
      Barbosa
      Rocha
      Lima
      Araújo
      Nascimento
      Moreira
      Gomes
      Martins
      Lopes
      Soares
      Fernandes
      Vieira
      Dias
      Monteiro
      Cardoso
      Mendes
      Freitas
      Ramos
      Gonçalves
      Castro
      Teixeira
      Moraes
      Azevedo
      Cunha
      Tavares
      Cavalcanti
      Correia
      Xavier
      Andrade
      Batista
      Campos
      Farias
      Pires
      Machado
      Nunes
      Melo
      Antunes
      Peixoto
      Queiroz
      Dantas
      Brito
      Miranda
      Freire
      Siqueira
      Figueiredo
      Pacheco
      Rezende
      Barros
      Braga
      Macedo
      Sales
      Guimarães
      Leal
      Fonseca
      Alves
      Rodrigues
      Santana
      Jesus
      Nogueira
      Matos
      Cruz
      Pinto
      Duarte
      Coelho
      Moura
      Borges
      Viana
      Furtado
      Neves
      Lourenço
    `),
    g('german', `
      Lukas
      Leonie
      Felix
      Lena
      Jonas
      Maximilian
      Marie
      Tobias
      Katharina
      Florian
      Johanna
      Niklas
      Sabine
      Stefan
      Ursula
      Moritz
      Anna
      Paul
      Emilia
      Leon
      Mia
      Ben
      Hannah
      Elias
      Laura
      David
      Clara
      Tim
      Lara
      Simon
      Marlene
      Johannes
      Greta
      Frieda
      Ida
      Luisa
      Theresa
      Sophie
      Charlotte
      Amelie
      Emil
      Oskar
      Anton
      Theo
      Julian
      Matthias
      Philipp
      Sebastian
      Alexander
      Daniel
      Michael
      Martin
      Christian
      Andreas
      Thomas
      Markus
      Jan
      Erik
      Jannik
      Mats
      Till
      Nico
      Vincent
      Benjamin
      Eva
      Julia
      Lisa
      Sarah
      Nina
      Isabel
      Anja
      Monika
      Heike
      Peter
      Wolfgang
      Klaus
      Jens
      Lars
      Oliver
      Patrick
    `, `
      Müller
      Schmidt
      Schneider
      Fischer
      Weber
      Meyer
      Wagner
      Becker
      Hoffmann
      Schulz
      Koch
      Richter
      Wolf
      Neumann
      Zimmermann
      Krüger
      Braun
      Schmitz
      Hartmann
      Lange
      Werner
      Krause
      Lehmann
      König
      Walter
      Huber
      Kaiser
      Fuchs
      Peters
      Schwarz
      Schäfer
      Böhm
      Schröder
      Bauer
      Roth
      Günther
      Berger
      Winkler
      Lorenz
      Baumann
      Albrecht
      Franke
      Jäger
      Dietrich
      Seidel
      Brandt
      Kuhn
      Sommer
      Schuster
      Schreiber
      Scholz
      Winter
      Vogt
      Ludwig
      Busch
      Hahn
      Sauer
      Bender
      Otto
      Ebert
      Fiedler
      Horn
      Stein
      Pohl
      Schubert
      Vogel
      Friedrich
      Schumann
      Krämer
      Engel
      Haas
      Arnold
      Heinrich
      Schilling
      Maurer
      Bayer
      Beck
      Buschmann
      Reuter
      Keller
    `),
    g('french', `
      Louis
      Camille
      Hugo
      Manon
      Théo
      Inès
      Arthur
      Léa
      Mathis
      Juliette
      Antoine
      Margaux
      Julien
      Élodie
      Baptiste
      Clémence
      Emma
      Gabriel
      Raphaël
      Louise
      Nathan
      Chloé
      Lucas
      Zoé
      Noah
      Sarah
      Enzo
      Eva
      Paul
      Alice
      Maël
      Jeanne
      Thomas
      Nicolas
      Maxime
      Romain
      Émile
      Victor
      Charles
      Anaïs
      Clara
      Pauline
      Lucie
      Amélie
      Léonie
      Élise
      Pierre
      Étienne
      Adrien
      Simon
      Rémi
      Vincent
      Olivier
      Mathilde
      Noémie
      Amandine
      Marion
      Sophie
      Caroline
      Aurélie
      Céline
      Adèle
      Cécile
      Hélène
      Isabelle
      Émilie
      Suzanne
      Jules
      Gaspard
      Augustin
      Félix
      Oscar
      Léon
    `, `
      Martin
      Bernard
      Dubois
      Robert
      Richard
      Petit
      Durand
      Leroy
      Moreau
      Simon
      Laurent
      Lefebvre
      Michel
      Fontaine
      Rousseau
      Girard
      Mercier
      Chevalier
      Roux
      Vincent
      Fournier
      Morel
      André
      Lambert
      Bonnet
      François
      Legrand
      Gauthier
      Garnier
      Faure
      Colin
      Vasseur
      Dumas
      Bertrand
      Lemaire
      Giraud
      Blanc
      Roussel
      Henry
      Masson
      Dumont
      Marchand
      Duval
      Denis
      Perrin
      Meunier
      Caron
      Rolland
      Leclerc
      Millet
      Boucher
      Lemoine
      Blanchard
      Dupont
      Boyer
      Guérin
      Guillet
      Pelletier
      Robin
      Philippe
      Adam
      Dumoulin
      Brun
      Aubert
      Barbier
      Perrot
      Bouvier
      Picard
      Noël
      Lacroix
      Renaud
      Germain
      Lacombe
      Bourgeois
      Royer
      Besson
      Bourdon
      Moulin
      Maillard
      Pichon
      Delaunay
      Lefort
      Bailly
      Dufour
      Poulain
      Carlier
      Vidal
    `),
    g('italian', `
      Lorenzo
      Giulia
      Alessandro
      Chiara
      Francesco
      Martina
      Matteo
      Federica
      Riccardo
      Elisa
      Davide
      Alessia
      Giorgio
      Francesca
      Antonio
      Sara
      Luca
      Sofia
      Marco
      Valentina
      Andrea
      Elena
      Stefano
      Beatrice
      Paolo
      Veronica
      Simone
      Irene
      Giovanni
      Giuseppe
      Luigi
      Pietro
      Carlo
      Filippo
      Tommaso
      Aurora
      Camilla
      Caterina
      Claudia
      Emma
      Giorgia
      Silvia
      Enrico
      Roberto
      Fabio
      Gabriele
      Michele
      Edoardo
      Federico
      Arianna
      Alice
      Anna
      Marta
      Viola
      Noemi
      Nadia
      Giulio
      Daniele
      Massimo
      Alberto
      Salvatore
      Vincenzo
      Nicola
      Lucia
      Maria
      Angela
      Laura
      Valeria
      Serena
      Giada
    `, `
      Rossi
      Russo
      Esposito
      Bianchi
      Romano
      Colombo
      Ricci
      Marino
      Greco
      Bruno
      Gallo
      Conti
      De Luca
      Mancini
      Giordano
      Rizzo
      Lombardi
      Ferrara
      Fontana
      Moretti
      Barbieri
      Santoro
      Mariani
      Rinaldi
      Caruso
      Ferri
      Gatti
      Villa
      Serra
      Costa
      Giuliani
      Mazza
      Parisi
      Bellini
      Vitale
      Riva
      Puglisi
      Bernardi
      Caputo
      Sanna
      Monti
      Farina
      Grassi
      Fabbri
      Lattanzi
      Galli
      Longo
      Neri
      Cattaneo
      Palmieri
      Testa
      Leone
      Amato
      Coppola
      Santini
      Basile
      Ruggiero
      Grimaldi
      Orlando
      Messina
      Pagano
      Fiore
      De Rosa
      Corsi
      Cavalli
      Donati
      Barone
      Sala
      Piras
      Nuzzo
      Gherardi
    `),
    g('dutch', `
      Daan
      Sanne
      Bram
      Femke
      Joost
      Lotte
      Thijs
      Eva
      Ruben
      Anouk
      Sem
      Fleur
      Lars
      Milan
      Noor
      Joris
      Isa
      Mees
      Lieke
      Niels
      Maud
      Timo
      Evi
      Jan
      Henk
      Kees
      Bas
      Guus
      Jelle
      Anne
      Dirk
      Gijs
      Koen
      Merel
      Roos
      Linde
      Puck
      Fenna
      Eline
      Stijn
      Teun
      Noud
      Luuk
      Mats
      Jesse
    `, `
      de Jong
      Jansen
      de Vries
      van den Berg
      van Dijk
      Bakker
      Visser
      Smit
      Meijer
      de Boer
      Mulder
      Dekker
      Vermeulen
      Peeters
      Bos
      Vos
      Peters
      Hendriks
      van Leeuwen
      van der Meer
      de Wit
      Dijkstra
      van Vliet
      Kuiper
      Jacobs
      Brouwer
      de Groot
      van der Laan
      van der Wal
      Willems
      van Beek
      van Dalen
      van der Ven
      van der Hoek
      van der Pol
      Kok
      Schouten
      Sanders
      van der Veen
      van der Werf
      Wolters
      Scholten
      Willemsen
      Kramer
      Koster
      Post
      van der Aa
      de Koning
      de Bruin
    `),
    g('central-european', `
      Jakub
      Zofia
      Kacper
      Maja
      Mikołaj
      Aleksandra
      Piotr
      Katarzyna
      Tomasz
      Agnieszka
      Paweł
      Magdalena
      Ondřej
      Tereza
      Luka
      Jelena
      Nikola
      Ivana
      Milan
      Jan
      Anna
      Martin
      David
      Daniel
      Filip
      Matěj
      Klára
      Veronika
      Lucie
      Barbora
      Eliška
      Šimon
      Natália
      Dominik
      Marek
      Lenka
      Václav
      Petra
      Wojciech
      Krzysztof
      Łukasz
      Maciej
      Grzegorz
      Michał
      Marcin
      Karol
      Ewa
      Monika
      Dorota
      Joanna
      Beata
      Milena
      Iveta
      Zuzana
      Štefan
      Bohumil
      Radek
      Stanisław
      Andrzej
      Zbigniew
      Krystyna
      Irena
      Elżbieta
      Małgorzata
      Agata
      Władysław
      Dariusz
      Sebastian
      Radosław
      Jiří
      Vojtěch
      Jaroslav
      Hana
      Eva
      Andrej
      Peter
      Alicja
      Julia
      Oskar
      Mateusz
      Bartosz
      Damian
      Adrian
      Kamil
      Rafał
      Patryk
      Kinga
      Paulina
      Emilia
      Oliwia
      Karolina
      Wiktoria
      Zdeněk
      Dušan
      Radim
    `, `
      Nowak
      Kowalski
      Wiśniewska
      Wójcik
      Kowalczyk
      Kamiński
      Lewandowska
      Zieliński
      Szymańska
      Dvořák
      Novotný
      Horvat
      Kovačević
      Petrović
      Jovanović
      Mazur
      Krawczyk
      Piotrowski
      Grabowska
      Pawłowski
      Król
      Wieczorek
      Beneš
      Černý
      Svoboda
      Kovář
      Šimek
      Marić
      Babić
      Nikolić
      Woźniak
      Dąbrowski
      Sokołowski
      Jankowski
      Mazurek
      Kaczmarek
      Procházka
      Veselý
      Němec
      Pokorný
      Blažek
      Růžička
      Knežević
      Matić
      Marković
      Adamczyk
      Dudek
      Zając
      Pawlak
      Michalski
      Jabłoński
      Krajewski
      Górski
      Holub
      Hájek
      Krejčí
      Perić
      Šarić
      Vuković
      Nowicka
      Sikorski
      Wróbel
      Kubiak
      Czarnecki
      Zawadzki
      Čížek
      Fiala
      Urban
      Marek
      Kolář
      Savić
      Božić
      Tomić
      Đorđević
    `),
    g('nordic', `
      Erik
      Ingrid
      Lars
      Astrid
      Mikkel
      Freja
      Oskar
      Sigrid
      Henrik
      Linnea
      Johan
      Elin
      Aino
      Eero
      Anders
      Nils
      Magnus
      Sven
      Ivar
      Stig
      Rasmus
      Maja
      Ida
      Nora
      Frida
      Hanna
      Thea
      Malin
      Emil
      Anton
      Viktor
      Elias
      Tobias
      Sofia
      Emma
      Ella
      Olivia
      Saga
      Tuva
      Karin
      Alva
      Arvid
      Ebba
      Haakon
      Isak
      Jonna
      Kjell
      Lykke
      Olav
      Rolf
      Stina
      Vilma
      Ylva
      Greta
      Ludvig
      Signe
      Gustav
      Lovisa
      Åsa
      Carl
      Knut
      Märta
      Pål
      Tove
      Ulf
    `, `
      Andersson
      Johansson
      Nilsson
      Larsen
      Hansen
      Nielsen
      Lindqvist
      Berg
      Halvorsen
      Virtanen
      Korhonen
      Eriksson
      Dahl
      Lund
      Olsen
      Pedersen
      Andersen
      Sorensen
      Jorgensen
      Thomsen
      Moller
      Johansen
      Solberg
      Haugen
      Moen
      Nieminen
      Laine
      Svensson
      Karlsson
      Persson
      Lindberg
      Lundberg
      Bergstrom
      Hagen
      Solheim
      Strand
      Rasmussen
      Madsen
      Makinen
      Mikkelsen
      Poulsen
      Myhre
      Bakke
      Lie
      Lehtinen
      Heikkinen
      Kallio
      Rantanen
      Salonen
      Nystrom
      Berglund
      Norberg
      Lindholm
      Sundberg
      Eklund
      Holmgren
      Iversen
      Ahlstrom
      Blomqvist
      Kinnunen
      Hietala
      Kettunen
    `),
    g('greek-turkish', `
      Nikos
      Eleni
      Giorgos
      Katerina
      Dimitris
      Despina
      Emre
      Elif
      Mehmet
      Zeynep
      Burak
      Ayşe
      Can
      Defne
      Andreas
      Maria
      Ioannis
      Sofia
      Kostas
      Vasilis
      Ahmet
      Fatma
      Mustafa
      Deniz
      Cem
      Ece
      Hakan
      Christos
      Spyros
      Thalia
      Kalliopi
      Ioanna
      Panos
      Selin
      Ceren
      Onur
      Murat
      Esra
      Kerem
      Stavros
      Angeliki
      Theodora
      Melina
      Fotini
      Nefeli
      Lefteris
      İrem
      Ömer
      Merve
      Büşra
      Gökhan
      Tolga
      Barış
      Eirini
      Georgia
      Vangelis
      Sotiris
      Manos
      Argyro
      Haris
      Aylin
      Yasemin
      Pınar
      Derya
      Serkan
      Levent
      Fırat
    `, `
      Papadopoulos
      Georgiou
      Nikolaidis
      Konstantinou
      Yılmaz
      Kaya
      Demir
      Şahin
      Çelik
      Aydın
      Öztürk
      Arslan
      Pappas
      Ioannou
      Antoniou
      Vassiliou
      Karagiannis
      Koç
      Yıldız
      Yıldırım
      Şimşek
      Çetin
      Özdemir
      Kılıç
      Dimitriou
      Christou
      Angelopoulos
      Theodorou
      Petrou
      Stavropoulos
      Doğan
      Güneş
      Kurt
      Özkan
      Polat
      Yalçın
      Oikonomou
      Papadakis
      Vlachos
      Sideris
      Mavridis
      Roussos
      Aksoy
      Korkmaz
      Erdem
      Taş
      Bulut
      Kaplan
      Makris
      Katsaros
      Zervas
      Galanis
      Kontos
      Xanthopoulos
      Acar
      Yavuz
      Şen
      Güler
      Keskin
      Avcı
    `),
    g('arabic', `
      Omar
      Layla
      Youssef
      Fatima
      Karim
      Nour
      Hassan
      Mariam
      Tariq
      Yasmin
      Khalid
      Salma
      Amir
      Rania
      Ziad
      Hana
      Aisha
      Ibrahim
      Samir
      Bilal
      Farah
      Mustafa
      Jamal
      Nadia
      Salim
      Huda
      Rami
      Dalia
      Fadi
      Munir
      Bassam
      Maha
      Ali
      Amina
      Khalil
      Hanan
      Nabil
      Rasha
      Wael
      Hisham
      Reem
      Bashir
      Latifa
      Anwar
      Fares
      Jamila
      Tamer
      Zainab
      Yasir
      Mahmoud
      Rashid
      Khadija
      Faisal
      Nasser
      Hadi
      Safiya
      Sanaa
      Munira
      Adnan
      Ghada
      Marwan
      Jaber
      Suha
      Ahmed
      Hamza
      Ismail
      Musa
      Anas
      Ammar
      Qasim
      Walid
      Talal
      Majid
      Iyad
      Amal
      Asma
      Iman
      Mona
      Nawal
    `, `
      Haddad
      Khalil
      Mansour
      Nasser
      Saleh
      Hamdan
      Aziz
      El-Sayed
      Farouk
      Benali
      Abboud
      Darwish
      Karam
      Tahan
      Bouzid
      Mahmoud
      Ibrahim
      Hussein
      Qasim
      Barakat
      Khoury
      Najjar
      Khatib
      Maalouf
      Matar
      Rashed
      Zahran
      Jaber
      Shihab
      Fawzi
      Alami
      Al-Masri
      Al-Amin
      Rahim
      Jamil
      Saad
      Tamimi
      Shami
      Badr
      Dabbagh
      Sayegh
      Halabi
      Adwan
      Khayat
      Sabbagh
      Bitar
      Attar
      Kassab
      Halwani
      Baghdadi
      Nabulsi
      Hijazi
      Hourani
      Shammari
      Ghamdi
      Asmar
      Fakhoury
      Kanaan
      Shalhoub
      Safadi
      Rizk
      Kassis
      Mikhail
      Touma
      Shukri
      Makki
      Ghali
      Najm
      Al-Harbi
      Qudsi
    `),
    g('persian', `
      Dariush
      Shirin
      Reza
      Parisa
      Kian
      Niloufar
      Arash
      Mina
      Rostam
      Sohrab
      Bahram
      Farhad
      Behnam
      Omid
      Nima
      Saman
      Navid
      Pouya
      Mehrdad
      Kamran
      Laleh
      Narges
      Sahar
      Roya
      Sepideh
      Shabnam
      Mitra
      Azadeh
      Leila
      Saba
      Anahita
      Nahid
    `, `
      Hosseini
      Rahimi
      Karimi
      Moradi
      Jafari
      Tehrani
      Ahmadi
      Azimi
      Bahrami
      Farhadi
      Hashemi
      Kazemi
      Naderi
      Nazari
      Nemati
      Daryani
      Davoodi
      Ranjbar
      Rostami
      Salehi
      Samadi
      Shafiei
      Soltani
      Yazdani
    `),
    g('south-asian', `
      Arjun
      Priya
      Rohan
      Ananya
      Vikram
      Kavya
      Aditya
      Diya
      Rahul
      Meera
      Karthik
      Lakshmi
      Siddharth
      Neha
      Imran
      Ayesha
      Farhan
      Sana
      Tanvir
      Nusrat
      Sanjay
      Deepa
      Ishaan
      Aarav
      Saanvi
      Isha
      Dev
      Nikhil
      Pooja
      Anjali
      Varun
      Rohit
      Shreya
      Amit
      Zoya
      Hamza
      Bilal
      Hina
      Yasmin
      Kabir
      Naveen
      Ritu
      Gopal
      Fatima
      Aditi
      Akash
      Aman
      Amina
      Areeba
      Danish
      Faisal
      Harish
      Irfan
      Junaid
      Kiran
      Manish
      Nisha
      Pallavi
      Pranav
      Rakesh
      Sameer
      Shalini
      Saira
      Suresh
      Tariq
      Yusuf
      Devika
      Siddhi
      Madhuri
      Hemant
      Pratik
      Shweta
      Pankaj
      Jyoti
      Lalita
      Mohan
      Suman
      Simran
      Navdeep
      Aarohi
      Tanmay
      Shankar
      Radhika
      Nandini
      Bhavna
      Anushka
      Rashmi
      Gaurav
      Sakshi
      Vivek
      Puneet
      Tushar
      Anirudh
      Prerna
      Ramesh
      Shabana
      Nazia
      Shahid
      Aqib
      Sajid
      Zubair
      Khalid
      Rizwan
      Rupali
      Sonal
      Kunal
    `, `
      Sharma
      Patel
      Gupta
      Reddy
      Iyer
      Nair
      Singh
      Kumar
      Mehta
      Joshi
      Chatterjee
      Banerjee
      Rao
      Pillai
      Desai
      Kapoor
      Chaudhry
      Hussain
      Ahmed
      Rahman
      Islam
      Perera
      Fernando
      Qureshi
      Ghosh
      Das
      Bose
      Saha
      Sengupta
      Malhotra
      Bhatia
      Arora
      Sethi
      Agarwal
      Chopra
      Verma
      Shah
      Parekh
      Kulkarni
      Deshmukh
      Menon
      Shrestha
      Mallick
      Sheikh
      Khan
      Mirza
      Siddiqui
      Ansari
      Jaffrey
      Sarkar
      Majumdar
      Barman
      Biswas
      Haque
      Qadri
      Lama
      Gurung
      Thapa
      Rana
      Koirala
      Adhikari
      Bandara
      Khanal
      Tripathi
      Tiwari
      Mishra
      Khanna
      Gill
      Dhillon
      Sandhu
      Bedi
      Jadhav
      Patil
      Pawar
      Naidu
      Hegde
      Shetty
      Talukder
      Bhuiyan
      Miah
      Basnet
      Poudel
      Silva
      Khatri
      Puri
      Luthra
      Anand
      Bansal
      Goel
      Garg
      Singhal
      Mittal
      Jindal
      Oberoi
      Bajaj
      Ahuja
      Wadhwa
      Sood
      Suri
      Narang
      Tamang
      Magar
      Karki
      Bista
      Rijal
      Ghimire
      Krishnan
    `),
    g('chinese', `
      Wei
      Mei
      Jun
      Xiu
      Hao
      Lin
      Jie
      Ying
      Yu
      Zhen
      Lan
      Bo
      Qing
      Ming
      Fang
      Xin
      Yan
      Hui
      Qian
      Jing
      Lei
      Tao
      Yao
      Jia
      Rui
      Xue
      Ning
      Dong
      Xia
      Na
      Kai
      Yi
      Wen
      Yue
      Chen
      Feng
      Ping
      Rong
      Chun
      Kun
      An
      Ziyi
      Min
      Hua
      Qiao
      Zimo
      Ziqi
      Yaqi
      Yuxi
      Ziyu
    `, `
      Wang
      Li
      Zhang
      Liu
      Chen
      Yang
      Huang
      Zhao
      Wu
      Zhou
      Xu
      Sun
      Ma
      Zhu
      Hu
      Guo
      Tan
      Lim
      Ng
      Wong
      Chan
      Cheung
      Ho
      Lau
      Liang
      Luo
      He
      Gao
      Zheng
      Xie
      Song
      Tang
      Deng
      Feng
      Cao
      Peng
      Zeng
      Xiao
      Tian
      Dong
      Pan
      Yuan
      Cai
      Su
      Wei
      Jiang
      Shen
      Lu
      Qin
      Qian
      Shi
      Yan
      Dai
      Mo
      Kong
      Bai
      Meng
      Hou
      Long
      Wan
      Qiu
      Fan
      Yao
      Tao
      Xiong
      Jin
      Shao
      Cui
      Zou
      Fu
      Ren
      Xia
      Cheng
      Lin
      Han
      Du
      Lei
      Ye
      Yu
      Jia
      Ding
      Qiao
      Liao
      Xue
      Gu
      Zhong
      Kang
      Mao
      Nie
      Yin
      Pei
      Duan
      Huo
      Ji
      Chai
      Bao
      Ruan
      Tong
      Xing
      An
      Zhai
      Qu
      Miao
      Gong
      Xiang
      You
      Bian
      Zhan
      Geng
      Xi
      Kuang
      Xun
      Cen
      Yun
      Shang
      Jiao
      Niu
      Zuo
      Hui
    `),
    g('japanese', `
      Haruto
      Yui
      Sota
      Hina
      Ren
      Aoi
      Yuto
      Sakura
      Kaito
      Mio
      Takumi
      Yuna
      Kenji
      Akiko
      Daiki
      Naomi
      Shota
      Ryota
      Riku
      Sora
      Kenta
      Shun
      Itsuki
      Masato
      Ayaka
      Rina
      Emi
      Mai
      Haruka
      Yuki
      Koki
      Kota
      Hinata
      Ryo
      Yuma
      Takeru
      Taiga
      Mei
      Kana
      Yuka
      Saki
      Miku
      Fumiko
      Keiko
      Sayaka
      Akira
      Taro
      Ichiro
      Jiro
      Makoto
      Kazuya
      Koji
      Noboru
      Tomoko
      Yoko
      Kaori
      Sayuri
      Mariko
      Naoki
      Shinya
      Kazuki
      Masaki
      Naoto
      Sho
      Jun
      Takuya
      Yusuke
      Ayumi
      Chie
      Eri
      Kyoko
      Maki
      Noriko
    `, `
      Sato
      Suzuki
      Takahashi
      Tanaka
      Watanabe
      Ito
      Yamamoto
      Nakamura
      Kobayashi
      Kato
      Yoshida
      Yamada
      Sasaki
      Matsumoto
      Inoue
      Kimura
      Hayashi
      Shimizu
      Mori
      Abe
      Ikeda
      Hashimoto
      Ishikawa
      Yamashita
      Ogawa
      Ishii
      Hasegawa
      Goto
      Okada
      Fujita
      Maeda
      Nakajima
      Kondo
      Ota
      Ueda
      Fujii
      Nishimura
      Okamoto
      Matsuda
      Nakagawa
      Nakano
      Harada
      Takeuchi
      Kaneko
      Wada
      Ishida
      Murakami
      Fujimoto
      Saito
      Endo
      Aoki
      Matsui
      Nakayama
      Chiba
      Kinoshita
      Imai
      Noguchi
      Hirano
      Otsuka
      Hattori
      Ando
      Kuroda
      Sugiyama
      Miyazaki
      Shibata
      Sakai
      Kudo
      Yokoyama
      Miyamoto
      Uchida
      Takagi
      Ueno
      Sugawara
      Morita
      Hirata
      Hara
      Fujiwara
      Shiraishi
      Oshima
    `),
    g('korean', `
      Min-jun
      Seo-yeon
      Ji-ho
      Ha-eun
      Do-yoon
      Ji-woo
      Hyun-woo
      Su-bin
      Jae-won
      Eun-ji
      Tae-yang
      Yeon-woo
      Seo-jun
      Ji-min
      Ha-joon
      Soo-ah
      Yu-jin
      Min-seo
      Da-eun
      Seung-ho
      Bo-ra
      Eun-seo
      Joon-ho
      Hye-jin
      Sung-min
      Mi-sook
      Hye-won
      Chan-woo
      Hyo-joo
      Gyu-ri
      Na-young
      Jin-woo
      Eun-woo
      Ji-hye
      Min-ji
      Soo-jin
      Ye-jun
      Ga-eun
      Hye-ri
      Tae-ho
      Min-ho
      Joo-won
      Sun-woo
      Ji-yoon
      Yeon-joo
      Hyo-min
      Da-hyun
    `, `
      Kim
      Lee
      Park
      Choi
      Jung
      Kang
      Cho
      Yoon
      Jang
      Han
      Shin
      Oh
      Seo
      Lim
      Ryu
      Ahn
      Song
      Kwon
      Huh
      Hong
      Jeon
      Ko
      Moon
      Yang
      Baek
      Bae
      Byun
      Cha
      Do
      Ha
      Joo
      Kwak
      Nam
      Noh
      Sim
      Woo
      Yeom
      Son
      Min
      Gu
      Eom
      Pyo
      Seol
      Gil
      Ma
      Jin
      Bang
      Won
      Gong
      Seok
      Wi
      Chu
      Eo
      Tak
      Yeo
      Je
      Seon
      Gye
    `),
    g('southeast-asian', `
      Minh
      Linh
      Tuan
      Thao
      Duc
      Huong
      Quang
      Ngoc
      Somchai
      Malee
      Niran
      Ploy
      Budi
      Siti
      Putri
      Agus
      Dewi
      Ramon
      Maricel
      Jericho
      Anh
      Bao
      Duy
      Khoa
      Phuong
      Anong
      Chai
      Kanya
      Preecha
      Somsak
      Rina
      Wayan
      Made
      Eko
      Rudi
      Maria
      Jose
      Lorna
      Rogelio
      Nina
      Huy
      Hai
      Hien
      Yen
      Nhi
      Thuy
      Nattaya
      Chaiwat
      Ayu
      Sri
      Yuni
      Dimas
      Fajar
      Carlo
      Miguel
      Angel
      Jessa
      Rowena
      Mai
      Thanh
      Vinh
      Trinh
      Binh
      Ngan
      My
      Loan
      Araya
      Chalida
      Thana
      Chompoo
      Kartika
      Intan
      Lestari
      Bayu
      Rizky
      Aisyah
      Farah
      Phuc
      Tien
      Dat
      Chau
      Kien
      Narong
      Wichai
      Suda
      Busaba
      Joko
      Hendra
      Anisa
      Rahayu
      Indah
      Sokha
      Vannak
      Sophea
      Thiri
    `, `
      Nguyen
      Tran
      Le
      Pham
      Hoang
      Vo
      Dang
      Bui
      Srisuk
      Chaiyaporn
      Wongsakul
      Santoso
      Wijaya
      Hidayat
      Kusuma
      Reyes
      Cruz
      Bautista
      Aquino
      Villanueva
      Dela Cruz
      Phan
      Truong
      Duong
      Ho
      Vu
      Ngo
      Do
      Mai
      Setiawan
      Saputra
      Pratama
      Lestari
      Wibowo
      Suryanto
      Purnama
      Garcia
      Mendoza
      Santos
      Ramos
      Torres
      Flores
      Dinh
      Cao
      Ly
      Nugroho
      Purwanto
      Mulyana
      Kurniawan
      Maulana
      Iskandar
      Mercado
      Navarro
      Ocampo
      Santiago
      Boonmee
      Thongthai
      Saetang
      Saengthong
      Khamsaen
      Sawangwong
      Chaiyasit
      Huynh
      Doan
      Vuong
      Srisawat
      Wongsawat
      Ratnaphan
      Saengsi
      Siregar
      Ginting
      Sihombing
      Nasution
      Hutabarat
      Nainggolan
      Fernandez
      Valdez
      Dizon
      Padilla
      Rivera
      Castillo
      Estrada
      Luong
      Luu
      Lam
      Ta
      Hartono
      Gunawan
      Susanto
      Haryanto
      Wahyudi
      Handoko
      Sulaiman
      Yusuf
      Lopez
      Diaz
      Gonzales
      Soriano
      Manalo
      Lim
      Tan
      Saelim
    `),
    g('african', `
      Chinedu
      Ngozi
      Oluwaseun
      Adaeze
      Emeka
      Folake
      Kwame
      Ama
      Kofi
      Abena
      Tunde
      Yetunde
      Amara
      Ifeoma
      Babajide
      Chiamaka
      Moussa
      Aminata
      Ibrahima
      Fatou
      Wanjiru
      Kamau
      Achieng
      Otieno
      Tendai
      Nomvula
      Sipho
      Thandiwe
      Abebe
      Selam
      Tesfaye
      Hiwot
      Olumide
      Ayodele
      Kelechi
      Nneka
      Chisom
      Boubacar
      Ousmane
      Mariama
      Awa
      Khadija
      Mame
      Cheikh
      Adama
      Nia
      Zawadi
      Asha
      Neema
      Baraka
      Jabari
      Zanele
      Lindiwe
      Themba
      Mandla
      Lerato
      Bongani
      Dawit
      Meseret
      Yonas
      Hana
      Alem
      Mekdes
      Chukwudi
      Uchechi
      Ifeanyi
      Obinna
      Nkiruka
      Chinwe
      Oluchi
      Bamidele
      Damilola
      Yewande
      Sade
      Kemi
      Akinyi
      Wambui
      Njeri
      Muthoni
      Juma
      Amina
      Hassan
      Yusuf
      Fatima
      Salma
      Zuberi
      Kito
      Tariro
      Rudo
      Farai
      Chipo
      Thabo
      Kgomotso
      Amadou
      Sekou
      Adeola
      Adebayo
      Adesola
      Abiola
      Esi
      Akosua
      Kwabena
      Yaa
      Efua
      Nana
      Kwaku
      Nosipho
      Sibusiso
      Palesa
      Karabo
      Keneilwe
      Gugu
      Ayanda
      Thulani
      Mandisa
      Wekesa
      Atieno
      Chebet
      Nuru
      Jelani
      Omari
      Idrissa
      Nnamdi
      Ogechi
      Onyeka
      Chidera
      Chibuzo
      Ikenna
      Ifunanya
      Olawale
      Olufemi
      Temitope
      Kehinde
      Taiwo
      Kojo
      Adjoa
      Akua
      Yaw
      Binta
      Kadiatou
      Ramatou
      Salif
      Mamadou
      Oumar
      Nanjala
      Nasimiyu
      Mpho
      Dineo
      Nandi
      Busisiwe
      Tewodros
      Genet
    `, `
      Okafor
      Adeyemi
      Okonkwo
      Balogun
      Eze
      Nwosu
      Adebayo
      Obi
      Mensah
      Asante
      Owusu
      Boateng
      Diallo
      Ndiaye
      Traoré
      Keita
      Kamara
      Mwangi
      Odhiambo
      Kariuki
      Njoroge
      Moyo
      Dlamini
      Nkosi
      Mokoena
      Khumalo
      Bekele
      Haile
      Girma
      Abiola
      Afolabi
      Chukwu
      Osei
      Appiah
      Addo
      Ofori
      Yusuf
      Bello
      Oladipo
      Onyeka
      Ekwueme
      Wekesa
      Kiptoo
      Mutua
      Kibet
      Wanjala
      Gichuru
      Mushi
      Kato
      Uwimana
      Mthembu
      Sithole
      Zulu
      Banda
      Rakoto
      Amoako
      Omondi
      Barasa
      Gatimu
      Munyua
      Chirwa
      Phiri
      Tembo
      Mumba
      Ndlovu
      Ncube
      Sibanda
      Maseko
      Mkhize
      Radebe
      Modise
      Molefe
      Nkomo
      Chiluba
      Kone
      Sow
      Diop
      Sarr
      Faye
      Cisse
      Toure
      Sanogo
      Sissoko
      Akinola
      Adebisi
      Okeke
      Umeh
      Ezenwa
      Nwankwo
      Nnamani
      Agyeman
      Kusi
      Tetteh
      Quaye
      Ankrah
      Kilonzo
      Ngugi
      Gichuhi
      Wanjohi
      Mugo
      Msuya
      Mhando
      Barry
      Jalloh
      Ba
      Gassama
      Ilunga
      Kasongo
      Mutombo
      Dube
      Eshun
      Nyarko
      Oduro
      Bonsu
      Darko
      Poku
      Agyekum
      Fofana
      Konaté
      Bamba
      Dramé
      Kouyaté
      Kanté
      Kargbo
      Koroma
      Sesay
      Conteh
      Musyoka
      Muthoni
      Mugisha
      Okello
      Otim
      Kisakye
      Tadesse
      Wolde
      Hassan
      Abdi
    `),
    g('hebrew', `
      Noa
      Yonatan
      Tamar
      Eitan
      Maya
      Ariel
      Yael
      Lior
      Omer
      Shira
      Hila
      Ayala
      Avital
      Hadar
      Michal
      Naama
      Amos
      Efrat
      Barak
      Boaz
      Doron
      Gilad
      Itamar
      Nadav
    `, `
      Cohen
      Levi
      Mizrahi
      Friedman
      Peretz
      Katz
      Shapiro
      Ben-David
      Rosen
      Segal
      Golan
      Dahan
      Shalev
      Dayan
      Elkayam
      Sarusi
      Ben-Ami
      Reshef
      Efrati
      Lifshitz
      Sasson
      Adler
      Goldstein
      Harel
      Sharon
      Gabay
      Abulafia
      Amsalem
      Biton
      Toledano
      Margalit
      Carmeli
    `),
    g('central-asian', `
      Bat-Erdene
      Oyunchimeg
      Temuulen
      Anu
      Bilguun
      Saruul
      Ganbold
      Nomin
      Aibek
      Aigerim
      Nurlan
      Madina
      Timur
      Alisher
      Gulnara
      Bakyt
      Ruslan
      Amina
      Zhanar
      Dastan
      Aizada
      Marat
      Elmira
      Bekzat
      Saltanat
      Ainur
      Azamat
      Arman
      Daniyar
      Ayan
      Adil
      Aisulu
      Tomiris
      Dinara
      Gulmira
      Sholpan
      Ermek
      Ulugbek
      Farhod
      Enkhjin
      Khulan
      Munkhzul
      Kairat
      Yerlan
      Serik
      Asel
      Meerim
      Cholpon
      Bakhtiyor
      Jamshid
      Nodira
      Shahnoza
      Erdenebat
      Gantulga
      Odbayar
      Tseren
      Bolormaa
      Oyunaa
      Tungalag
      Dilshod
      Sardor
      Behruz
      Dilorom
      Firuza
    `, `
      Batbayar
      Gantulga
      Erdenebat
      Tsogtbaatar
      Dorj
      Zhumabekov
      Seitkali
      Karimov
      Abdullaev
    `),
    g('east-slavic', `
      Dmitri
      Olga
      Alexei
      Natalia
      Ivan
      Tatiana
      Andriy
      Oksana
      Mykola
      Iryna
      Anatoly
      Gleb
      Stepan
      Roman
      Vadim
      Denis
      Nikita
      Maksim
      Mikhail
      Taras
      Bohdan
      Ostap
      Danylo
      Leonid
      Valeriy
      Halyna
      Lesya
      Larysa
      Zlata
      Alina
      Daria
      Kira
      Marina
      Polina
      Yulia
      Lyubov
      Inessa
      Zinaida
      Ludmila
      Ksenia
    `, `
      Ivanov
      Petrova
      Smirnov
      Volkova
      Kuznetsov
      Shevchenko
      Kovalenko
      Bondarenko
      Melnyk
      Sokolova
      Titova
      Orlova
      Pavlov
      Frolova
      Medvedev
      Vlasova
      Egorov
      Vinogradov
      Zaitsev
      Lebedeva
      Sorokin
      Nikitina
      Tarasov
      Romanova
      Kulikov
      Fedorova
      Tkachenko
      Kravchenko
      Kovalchuk
      Savchenko
      Marchenko
      Lysenko
      Oliynyk
      Rudenko
      Morozenko
      Dmytrenko
      Klymenko
      Havryliuk
      Dovzhenko
      Polishchuk
    `),
    g('pacific', `
      Aroha
      Tane
      Mere
      Wiremu
      Kalani
      Leilani
      Koa
      Malia
      Hemi
      Huia
      Kiri
      Anaru
      Matiu
      Rawiri
      Nikau
      Hinemoa
      Awhina
      Horiana
      Ria
      Pita
      Keoni
      Kaleo
      Ikaika
      Alika
      Kainoa
      Maile
      Momi
      Nani
      Loke
      Makana
      Keanu
      Nohea
    `, `
      Ngata
      Parata
      Te Rangi
      Kealoha
      Tupou
      Fifita
      Tuilagi
      Ropata
      Rameka
      Tamati
      Winiata
      Te Aho
      Perenara
      Te Puni
      Te Kahu
      Tahana
      Kahale
      Kalama
      Kekoa
      Kawai
      Akana
      Kamaka
      Finau
      Faletau
      Fakahau
      Faumuina
      Satele
      Tagaloa
    `),
    g('gaelic', `
      Aoife
      Cian
      Niamh
      Siobhan
      Eoin
      Ciara
      Callum
      Isla
      Ewan
      Fiona
    `, `
      O'Brien
      O'Connor
      Kelly
      Byrne
      Walsh
      Ryan
      McCarthy
      Doyle
      MacDonald
      Campbell
      Stewart
      Fraser
      Murray
      Ross
      Liam
      Sean
      Conor
      Declan
      Ronan
      Patrick
      Aidan
      Orla
      Maeve
      Aisling
      Deirdre
      Brigid
      Lachlan
      Hamish
      Seamus
      Tadhg
      Darragh
      Fionn
      Oisin
      Caoimhe
      Sinead
      Eimear
      Grainne
      Cormac
      Fergus
      Angus
      Alasdair
      Mairi
      Nuala
      Eilidh
      Iona
      Catriona
      Finlay
      Rory
      Brendan
      Kieran
      Malachy
      Roisin
      Aine
      Una
      Sorcha
      Donal
      Ciaran
      Padraig
      Cillian
      Lorcan
      Diarmuid
      Cathal
      Niall
      Fergal
      Clodagh
      Saoirse
      Muireann
      Ailbhe
      Morag
      Shona
    `),
    g('american', `
      DeShawn
      Aaliyah
      Jamal
      Imani
      Darius
      Keisha
      Marcus
      Jada
      Terrence
      Tiana
      Andre
      Nia
      Malik
      Zion
      Xavier
      Jalen
      Tyrese
      Amari
      Kendra
      Latoya
      Shanice
      Monique
      Patrice
      Ebony
      Aisha
      Jasmine
      Rashad
      Cedric
      Darrell
      Corey
      Rodney
      Tamara
      Brianna
      Antoine
      Shanell
      Ethan
      Noah
      Olivia
      Madison
      Logan
      Chloe
      Isaiah
      Cameron
      Savannah
      Elijah
      Brooke
      Jordan
      Emily
      Benjamin
      Taylor
      Morgan
      Caleb
      Destiny
      DeAndre
      Kiara
      Kayla
      Trevor
      Jocelyn
    `, `
      Washington
      Jefferson
      Jackson
      Coleman
      Simmons
      Freeman
      Banks
      Dawson
    `),
  ];

  const uniq = (xs) => Array.from(new Set(xs));
  const FIRST_NAMES = uniq(NAME_GROUPS.flatMap((x) => x.first));
  const LAST_NAMES = uniq(NAME_GROUPS.flatMap((x) => x.last));

  // Groups that have at least one first name in each split part, so a heldout draw is really heldout.
  const groupsFor = {};
  const inPart = (x, want) => want === 'all' || C.isHeldout(x) === (want === 'heldout');
  for (const want of ['train', 'heldout', 'all']) {
    const gs = NAME_GROUPS.filter((x) => x.first.some((n) => inPart(n, want)));
    groupsFor[want] = gs.length ? gs : NAME_GROUPS;
  }

  function personName(rng, opts = {}) {
    const want = opts.csplit || 'train';
    const cs = { csplit: want };
    const pool = groupsFor[want] || NAME_GROUPS;
    const group = (opts.origin && NAME_GROUPS.find((x) => x.origin === opts.origin)) || rng.pick(pool);
    const first = C.pick(rng, group.first, cs);
    const mix = opts.mix == null ? 0.2 : opts.mix;
    const own = !rng.bool(mix) && group.last.some((n) => inPart(n, want));
    const last = C.pick(rng, own ? group.last : LAST_NAMES, cs);
    // East Asian names are often written family name first; opts.familyFirst gives that order in `full`.
    const full = opts.familyFirst ? `${last} ${first}` : `${first} ${last}`;
    return { first, last, full, origin: group.origin };
  }

  const handle = (s) => C.ascii(s).toLowerCase().replace(/[^a-z0-9]/g, '');

  function username(rng, person) {
    const f = handle(person.first);
    const l = handle(person.last);
    const n2 = String(rng.int(1, 99));
    const yr = String(rng.pick([84, 87, 90, 91, 93, 95, 97, 98, 99, 2001, 2003, 2010]));
    const pats = [
      () => `${f}.${l}`,
      () => `${f}${l}`,
      () => `${f[0]}${l}`,
      () => `${f}_${l}`,
      () => `${f}${n2}`,
      () => `${f}.${l}${n2}`,
      () => `${l}.${f}`,
      () => `${f[0]}.${l}`,
      () => `${f}${yr}`,
      () => `${l}${f[0]}${n2}`,
      () => `${f}-${l[0]}`,
      () => `the${f}`,
    ];
    return rng.pick(pats)();
  }

  const EMAIL_DOMAINS = L(`
    quillpost.com
    mailharbor.net
    postlark.com
    inboxly.io
    nimbusmail.org
    letterbox.co.uk
    swiftpost.net
    pinemail.com
    courierbox.com
    tidewater-mail.com
    hearthmail.net
    owlpost.io
    brightinbox.com
    ferrymail.de
    corvidmail.fr
    zephyrpost.com
    mailmeadow.org
    parcelnote.com
    lanternmail.net
    driftbox.io
    northwind-logistics.com
    bluepeaklabs.io
    okaforandsons.co.uk
    halvorsen-group.no
    meridian-analytics.de
    saltmarshcoffee.com
    ironbridge-legal.com
    copperleaf.studio
    tallgrass-health.org
    kestrel-systems.com
    juniperbank.example
    lumenworks.io
    oakhollow.edu
    riverbend-city.gov
    fernhill-school.org
    granitepeak.ca
    mapleleaf-dental.ca
    sunfield-farms.com.au
    harbourview.co.nz
    vila-verde.com.br
    casadelsol.es
    rossi-ferri.it
    kanaal-media.nl
    wisla-tech.pl
    sakura-trading.jp
    jadeport.cn
    example.com
    example.org
    velvetdispatch.com
    cinderinbox.net
    marigoldletters.org
    hushpost.io
    daybreakcourier.com
    rookerymail.net
    cloudweave.org
    gullwingpost.com
    moonlitmessages.co.uk
    willowparcel.de
    postscriptbay.fr
    amberquillmail.com
    windwardletters.net
    pocketpostbox.io
    bluebellcourier.org
    silverthreadmail.com
    thistlepost.co.nz
    quietlantern.net
    redclay-heritage.org
    windmere-orchards.com
    cairnfield-museum.org
    holloway-atelier.fr
    larkspur-marine.ca
    mossbank-library.org
    embervale-theatre.com
    wrenford-council.gov
    cloudmere-academy.edu
    ashgrove-works.ie
    cobalt-hollow.nl
    birchwater-studio.dk
    longmeadow-press.com
    sablecoast-lodge.pt
    nordlicht-kultur.de
    piedra-clara.es
    vallequieto.it
    kumo-no-mori.jp
    qinghe-crafts.cn
    zielony-most.pl
    pohjan-tupa.fi
    canto-do-vale.br
    farrowmere.org
    reedandriver.net
    postcove.org
    mistralmail.com
    willowink.net
    foxtrail-post.com
    brightquarry.io
    silverfen.org
    maplewharf.co.uk
    bellwether-studio.com
    alderbrook.edu
    redkite-press.ie
    meadowlark-mail.net
    cypressledger.example
    hinterland-works.de
    cobaltmeadow.org
    thimblepost.io
    marbleharbor.com
    juniperandash.co.uk
    frostline-research.no
    archwaycourier.net
    oldmill-collective.fr
    coralridge.nz
    paperbirch-mail.com
    clovergate-school.org
    vespermail.net
    bramblewick.com
    sundial-letters.org
    kettlepond.studio
    saffronharbor.in
    redwoodatelier.pt
    windrow-academy.edu
    seabrook-notes.ie
    orchardgate.de
    mistvale-post.org
    cairnstone-mail.co.uk
    lilacfen.com
    honeycomb-harbor.net
    quietgrove.example
    lanternandloom.com
    pinecone-courier.au
    rivermint.org
    cloudberry-post.fi
    morningbell-press.com
    willowmere.io
    heatherglen-mail.com
    sundewmail.net
    harborwren.io
    inkwellparcel.org
    copperfinch.co.uk
    blueglen-notes.com
    fablecourier.net
    meadowglass.org
    starlingdispatch.com
    vellumletter.fr
    morrowfield.co.nz
    amberfen-studio.com
    rosemarypost.ie
    cloudmill.org
    gossamerbox.com
    brindlewood.net
    saltwind-messages.pt
    honeyvale.edu
    turnstone-mail.ca
    littlerookery.com
    orchidwharf.sg
    nettlewick.de
    puddlejump-post.au
    quartzharbor.jp
    birchandbloom.example
    rillstone.jp
    indigorill.in
    bluecairn.org
    farthingale-mail.com
    cedarspool.net
    greymantle.example
    frostedfig.fr
    woollyfern.fi
    kilnside.io
    plumtreeletters.org
    hollowreed.nl
    brightskein.dk
    westerlyparcel.es
    mossywindow.studio
    poppyseedpost.com
    brookhaven-notes.no
    candlewick-mail.net
    cobblebrook-mail.com
    tamarackfold.org
    marmaladepress.it
    vellichorpost.net
    rainbarrel-mail.org
    cobwebcourier.com
    thimbleharbor.io
    bayberryletters.net
    brasswillow.org
    northglass-mail.com
    pennantpost.ie
    lowtide-inbox.com
    bluefenstudio.org
    cairnwhistle.net
    morrowbrook.edu
    claymeadow.de
    sunkenbell.fr
    silverpurl.dk
    orchardwhistle.au
    gorseledger.example
    stoneferry.no
    paperlanternpost.jp
    wheatfield-mail.ca
    marshmallowquay.org
    fennelpost.fi
    rivermarrow.it
    smallweather.co.nz
    hushwillow-mail.com
    sugarloafletters.pt
    mothwingcourier.org
    copperthicket.nl
    woolgather-post.com
    farharbor-notes.ie
    birchgate-mail.de
    redcapdispatch.co.uk
    lilypadparcel.au
    claywhistle.org
    violetquarry.net
    mossandmarl.com
    saffronbell.in
    windlasspost.ca
    hazelglass.example
    skylarkferry.es
    ribbonwood-mail.jp
    dunequay.org
    ploverpost.dk
    seawallletters.com
    copperlilt.net
  `);

  function emailAddress(rng, person, domain) {
    const f = handle(person.first);
    const l = handle(person.last);
    const local = rng.pick([`${f}.${l}`, `${f}.${l}`, `${f}`, `${f[0]}${l}`, `${f}${l[0]}`, `${l}.${f}`,
      `${f}_${l}`, `${f}${rng.int(1, 99)}`, `${f[0]}.${l}`]);
    return `${local}@${domain || rng.pick(EMAIL_DOMAINS)}`;
  }

  const JOB_TITLES = L(`
    Software Engineer
    Senior Software Engineer
    Staff Engineer
    Engineering Manager
    Frontend Developer
    Backend Developer
    Full-Stack Developer
    Mobile Developer (iOS)
    Android Developer
    DevOps Engineer
    Site Reliability Engineer
    QA Analyst
    Test Automation Engineer
    Data Analyst
    Data Scientist
    Machine Learning Engineer
    Data Engineer
    Database Administrator
    Security Analyst
    IT Support Specialist
    Systems Administrator
    Network Engineer
    Solutions Architect
    Product Manager
    Senior Product Manager
    Product Owner
    Product Designer
    UX Researcher
    UI Designer
    Graphic Designer
    Content Designer
    Technical Writer
    Copywriter
    Content Strategist
    Marketing Manager
    Growth Marketer
    SEO Specialist
    Social Media Coordinator
    Brand Manager
    Communications Lead
    Public Relations Officer
    Sales Representative
    Account Executive
    Account Manager
    Sales Director
    Business Development Manager
    Customer Success Manager
    Customer Support Agent
    Support Team Lead
    Call Center Supervisor
    Office Manager
    Executive Assistant
    Administrative Assistant
    Receptionist
    Operations Manager
    Operations Analyst
    Project Manager
    Program Manager
    Scrum Master
    Business Analyst
    Financial Analyst
    Accountant
    Senior Accountant
    Payroll Specialist
    Controller
    Chief Financial Officer
    Chief Executive Officer
    Chief Operating Officer
    Chief Technology Officer
    VP of Engineering
    VP of Sales
    Head of People
    HR Generalist
    Recruiter
    Talent Acquisition Partner
    Learning and Development Coordinator
    Legal Counsel
    Paralegal
    Compliance Officer
    Procurement Specialist
    Supply Chain Analyst
    Logistics Coordinator
    Warehouse Supervisor
    Fleet Manager
    Facilities Coordinator
    Registered Nurse
    Nurse Practitioner
    Physician Assistant
    Pharmacist
    Physical Therapist
    Dental Hygienist
    Lab Technician
    Research Scientist
    Postdoctoral Researcher
    Lecturer
    Teaching Assistant
    Librarian
    Architect
    Civil Engineer
    Mechanical Engineer
    Electrical Engineer
    Site Foreman
    Interior Designer
    Photographer
    Video Editor
    Event Planner
    Chef de Partie
    Restaurant Manager
    Barista
    Store Manager
    Visual Merchandiser
    Real Estate Agent
    Insurance Underwriter
    Claims Adjuster
    Intern, Marketing
    Junior Developer
    Firmware Engineer
    Compiler Engineer
    Game Developer
    Infrastructure Engineer
    Platform Engineer
    Release Engineer
    Build Engineer
    Performance Engineer
    Accessibility Specialist
    Penetration Tester
    IT Auditor
    Pre-Sales Engineer
    Systems Engineer
    Robotics Engineer
    Computer Vision Engineer
    Quantitative Analyst
    Statistician
    Analytics Engineer
    ETL Developer
    Research Analyst
    Survey Researcher
    Program Coordinator
    Portfolio Manager
    Delivery Manager
    Change Manager
    Risk Manager
    Quality Engineer
    Usability Tester
    Interaction Designer
    Service Designer
    Design Systems Lead
    Illustrator
    Animator
    Motion Graphics Designer
    Art Director
    Creative Director
    Editor
    Managing Editor
    Proofreader
    Grant Writer
    Technical Editor
    Podcast Producer
    Broadcast Journalist
    News Reporter
    Community Manager
    Partnerships Manager
    Email Marketing Manager
    Paid Media Specialist
    Market Researcher
    Publicist
    Sales Operations Analyst
    Channel Partner Manager
    Territory Sales Manager
    Client Services Manager
    Escalation Specialist
    Knowledge Manager
    HR Business Partner
    Compensation Analyst
    Benefits Coordinator
    Workforce Planner
    Training Specialist
    Corporate Counsel
    Contracts Administrator
    Privacy Officer
    Policy Analyst
    Fraud Investigator
    Internal Auditor
    Tax Analyst
    Treasury Analyst
    Cost Accountant
    Accounts Payable Clerk
    Billing Coordinator
    Purchasing Manager
    Inventory Planner
    Demand Planner
    Import Coordinator
    Export Specialist
    Distribution Manager
    Transportation Planner
    Shipping Clerk
    Production Supervisor
    Manufacturing Engineer
    Process Engineer
    Industrial Designer
    Equipment Operator
    Building Inspector
    Landscape Architect
    Land Surveyor
    Urban Planner
    Permit Coordinator
    Property Manager
    Leasing Consultant
    Veterinary Technician
    Chief of Staff
    Cloud Architect
    Cloud Engineer
    Application Developer
    Software Architect
    Systems Analyst
    Computer Programmer
    Database Developer
    Data Architect
    Data Governance Manager
    Blockchain Developer
    Field Service Technician
    Hardware Engineer
    Mechatronics Engineer
    Automation Engineer
    Control Systems Engineer
    Aerospace Engineer
    Chemical Engineer
    Environmental Engineer
    Geotechnical Engineer
    Water Resources Engineer
    Energy Auditor
    Construction Manager
    Construction Estimator
    Carpenter
    Electrician
    Plumber
    Welder
    HVAC Technician
    Machinist
    Tool and Die Maker
    CNC Programmer
    Production Planner
    Manufacturing Technician
    Food Scientist
    Agronomist
    Horticulturist
    Forestry Technician
    Wildlife Biologist
    Environmental Scientist
    Geologist
    Meteorologist
    Archivist
    Museum Curator
    Museum Educator
    Academic Advisor
    School Counselor
    Secondary School Teacher
    Instructional Designer
    Admissions Counselor
    University Registrar
    Principal
    Translator
    Interpreter
    Speechwriter
    Park Ranger
    Firefighter
    Police Dispatcher
    Court Reporter
    Court Administrator
    Probation Officer
    Urban Designer
    Transit Planner
    Air Traffic Controller
    Pilot
    Flight Attendant
    Ship Captain
    Port Operations Manager
    Customs Broker
    Travel Consultant
    Hotel Front Desk Agent
    Housekeeping Manager
    Catering Manager
    Pastry Chef
    Sommelier
    Personal Trainer
    Athletic Coach
    Talent Manager
    Stage Manager
    Sound Engineer
    Lighting Designer
    Set Designer
    Costume Designer
    Jewelry Designer
    Fashion Designer
    Textile Designer
    Actuary
    Recreation Coordinator
    Aquaculture Technician
    Cartographer
    Chief Data Officer
    Chief Marketing Officer
    Chief Revenue Officer
    Chief Legal Officer
    Chief Product Officer
    Chief Design Officer
    Chief Strategy Officer
    Chief Learning Officer
    Deputy Director
    Regional Director
    General Manager
    Branch Manager
    Department Head
    Practice Manager
    Engagement Manager
    Strategy Manager
    Transformation Manager
    Management Consultant
    Technology Consultant
    Cybersecurity Consultant
    ERP Consultant
    Statistical Programmer
    Forensic Accountant
    Investment Analyst
    Credit Analyst
    Loan Officer
    Mortgage Broker
    Portfolio Analyst
    Pension Administrator
    Insurance Broker
    Reinsurance Analyst
    Underwriting Assistant
    Actuarial Analyst
    Fund Accountant
    Securities Trader
    Real Estate Appraiser
    Title Examiner
    Escrow Officer
    Mortgage Loan Processor
    Home Energy Rater
    Building Code Consultant
    Fire Protection Engineer
    Structural Engineer
    Geotechnical Drafter
    Surveying Technician
    CAD Drafter
    BIM Coordinator
    Water Treatment Operator
    Wastewater Engineer
    Stormwater Planner
    Hydrologist
    Soil Scientist
    Ecologist
    Marine Biologist
    Botanist
    Entomologist
    Conservation Officer
    Climate Analyst
    Solar Energy Technician
    Wind Turbine Technician
    Geothermal Engineer
    Power Systems Engineer
    Electrical Grid Operator
    Nuclear Engineer
    Petroleum Geologist
    Mining Engineer
    Metallurgist
    Materials Scientist
    Polymer Engineer
    Packaging Engineer
    Textile Technologist
    Bioprocess Engineer
    Microbiologist
    Biochemist
    Geneticist
    Laboratory Manager
    Animal Behaviorist
    Zoologist
    Aquatic Ecologist
    Food Safety Inspector
    Brewmaster
    Baker
    Butcher
    Food Service Director
    Grocery Buyer
    Patent Examiner
    Geospatial Analyst
    Music Director
    Collections Specialist
    Help Desk Technician
    Desktop Support Analyst
    IT Service Manager
    Cloud Security Engineer
    Security Architect
    Data Quality Analyst
    Master Data Specialist
    Data Catalog Manager
    Data Platform Engineer
    AI Ethics Researcher
    Computational Linguist
    Geospatial Data Engineer
    Remote Sensing Analyst
    Business Systems Analyst
    Enterprise Architect
    Agile Coach
    Engineering Director
    Director of Data Science
    Director of Product
    Executive Director
    Fundraising Manager
    Volunteer Coordinator
    Membership Coordinator
    Grant Administrator
    Localization Specialist
    Terminology Manager
    Subtitler
    Captioning Specialist
    Bookkeeper
    Revenue Accountant
    Transfer Pricing Analyst
    Credit Risk Modeler
    Loan Underwriter
    Trade Operations Analyst
    Portfolio Risk Analyst
    Claims Examiner
    Loss Control Consultant
    HRIS Analyst
    Recruitment Coordinator
    Executive Recruiter
    Ergonomics Consultant
    Travel Manager
    Laboratory Assistant
    Biostatistician
    Animal Care Technician
    Wildlife Rehabilitator
    Greenhouse Manager
    Soil Conservationist
    Irrigation Technician
    Food Product Developer
    Sensory Scientist
  `);

  const DEPARTMENTS = L(`
    Engineering
    Product
    Design
    Marketing
    Sales
    Customer Support
    Customer Success
    Finance
    Accounting
    Human Resources
    People Operations
    Legal
    Compliance
    Operations
    IT
    Information Security
    Data & Analytics
    Research and Development
    Quality Assurance
    Procurement
    Logistics
    Facilities
    Communications
    Business Development
    Partnerships
    Training
    Administration
    Executive Office
    Platform
    Infrastructure
    Growth
    Content
    Brand
    Risk Management
    Investor Relations
    Talent Acquisition
    Employee Relations
    Payroll
    Tax
    Treasury
    Internal Audit
    Corporate Strategy
    Market Research
    User Research
    Machine Learning
    Developer Relations
    Technical Writing
    Localization
    Public Relations
    Sustainability
    Manufacturing
    Production Planning
    Supply Chain
    Inventory Control
    Field Services
    Account Management
    Sales Operations
    Revenue Operations
    Product Operations
    Research Operations
    Cloud Services
    Network Operations
    Customer Education
    Workforce Planning
    Licensing
    Editorial
    Community Management
    Data Governance
    Business Systems
    Data Engineering
    Applied Science
    Accessibility
    Privacy
    Ethics
    Creative Services
    Studio Operations
    Audio Production
    Publishing
    Copywriting
    Records Management
    Knowledge Management
    Workplace Experience
    Office Management
    Vendor Management
    Fleet Management
    Distribution
    Warehouse Operations
    Retail Operations
    Franchise Operations
    Billing Operations
    Business Analysis
    Change Management
    Project Management
    Program Management
    People Analytics
    Learning Design
    Culinary Operations
    Museum Services
    Transit Operations
    Regulatory Affairs
    Strategic Sourcing
    Demand Planning
    Order Management
    Packaging Operations
    Materials Management
    Occupational Safety
    Energy Management
    Building Operations
    Business Continuity
    Threat Intelligence
    Incident Response
    Release Management
    Developer Experience
    Product Marketing
    Sales Enablement
    Customer Onboarding
    Compensation
    Visitor Services
    Ticketing Operations
    Exhibition Design
    Conservation
    Motion Graphics
    Exhibit Fabrication
    Broadcast Operations
    Agronomy
    Crop Science
    Animal Husbandry
    Food Science
    Hospitality
    Housekeeping
    Reservations
    Tour Operations
    Airport Operations
    Aviation Services
    Maritime Operations
    Port Services
    Postal Services
    Water Utilities
    Waste Management
    Recycling Operations
    Parks and Recreation
    Public Works
    Physical Security
    Fire Protection
    Architecture
    Interior Design
    Fashion Design
    Costume Design
    Stage Management
    Lighting Design
    Sound Design
    Animation
    Game Design
    Alumni Relations
    Student Services
    Academic Affairs
  `);

  // '#' = random digit. National and international patterns per locale (fictional or reserved ranges where
  // a country has them: US 555-01xx, UK 07700 900xxx, AU 0491 570 xxx).
  const PHONE_FORMATS = {
    'en-US': { national: ['(###) 555-01##', '###-555-01##', '###.555.01##'], intl: ['+1 ###-555-01##', '+1 (###) 555-01##'] },
    'en-GB': { national: ['07700 900###', '020 7946 0###', '0161 496 0###'], intl: ['+44 7700 900###', '+44 20 7946 0###'] },
    'de-DE': { national: ['030 #######', '089 ########', '0151 ########', '040 ### ###-##'], intl: ['+49 30 #######', '+49 151 ########'] },
    'fr-FR': { national: ['01 ## ## ## ##', '06 ## ## ## ##', '04 ## ## ## ##'], intl: ['+33 1 ## ## ## ##', '+33 6 ## ## ## ##'] },
    'es-ES': { national: ['91 ### ## ##', '6## ### ###', '93 ### ## ##'], intl: ['+34 91 ### ## ##', '+34 6## ### ###'] },
    'pt-BR': { national: ['(11) 9####-####', '(21) 9####-####', '(31) ####-####'], intl: ['+55 11 9####-####', '+55 21 ####-####'] },
    'it-IT': { national: ['06 #### ####', '02 #### ####', '3## ### ####'], intl: ['+39 06 #### ####', '+39 3## ### ####'] },
    'nl-NL': { national: ['020 ### ####', '06 ########', '010 ### ####'], intl: ['+31 20 ### ####', '+31 6 ########'] },
    'pl-PL': { national: ['22 ### ## ##', '5## ### ###', '12 ### ## ##'], intl: ['+48 22 ### ## ##', '+48 5## ### ###'] },
    'ja-JP': { national: ['03-####-####', '06-####-####', '090-####-####', '080-####-####'], intl: ['+81 3-####-####', '+81 90-####-####'] },
    'zh-CN': { national: ['138 #### ####', '139 #### ####', '010-########', '021-########'], intl: ['+86 138 #### ####', '+86 10 ########'] },
    'en-AU': { national: ['0491 570 ###', '(02) 5550 ####'], intl: ['+61 491 570 ###'] },
    'en-CA': { national: ['(###) 555-01##'], intl: ['+1 ###-555-01##'] },
  };

  function phone(rng, localeId = 'en-US') {
    const f = PHONE_FORMATS[localeId] || PHONE_FORMATS['en-US'];
    const pat = rng.bool(0.75) ? rng.pick(f.national) : rng.pick(f.intl);
    let first = true;
    return pat.replace(/#/g, () => {
      // An area code never starts with 0 or 1 in the US pattern's leading '###'.
      const d = first && /^[(]?#/.test(pat) ? rng.int(2, 9) : rng.int(0, 9);
      first = false;
      return String(d);
    });
  }

  Object.assign(C, {
    NAME_GROUPS,
    FIRST_NAMES,
    LAST_NAMES,
    personName,
    username,
    emailAddress,
    EMAIL_DOMAINS,
    JOB_TITLES,
    DEPARTMENTS,
    PHONE_FORMATS,
    phone,
  });
})();
