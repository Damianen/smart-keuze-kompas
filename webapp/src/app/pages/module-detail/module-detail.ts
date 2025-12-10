import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Module {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  ects: number;
  period: string;
  category: string;
  prerequisites?: string;
  learningGoals: string[];
  teacher: string;
  duration: string;
  assessment: string;
}

@Component({
  selector: 'app-module-detail',
  imports: [RouterLink],
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css'
})
export class ModuleDetailComponent implements OnInit {
  protected module = signal<Module | null>(null);
  protected loading = signal(true);

  // Mock data - in real app zou dit van een service komen
  private readonly modules: Module[] = [
    {
      id: 1,
      title: 'Web Development Advanced',
      description: 'Leer moderne web frameworks en best practices voor front-end ontwikkeling.',
      fullDescription: 'In deze module verdiep je je in geavanceerde web development technieken. Je leert werken met moderne JavaScript frameworks zoals React, Vue of Angular, en je ontdekt best practices voor het bouwen van schaalbare en onderhoudbare webapplicaties. Ook komen onderwerpen als state management, routing, en API integratie aan bod.',
      ects: 5,
      period: 'Periode 1',
      category: 'Development',
      prerequisites: 'Basis programmeerkennis in JavaScript en HTML/CSS',
      learningGoals: [
        'Werken met moderne JavaScript frameworks (React/Vue/Angular)',
        'Responsive web design implementeren met moderne CSS technieken',
        'API integratie en asynchrone data handling',
        'State management patterns toepassen',
        'Unit testing en end-to-end testing',
        'Performance optimalisatie technieken'
      ],
      teacher: 'Dr. J. van der Berg',
      duration: '8 weken (4 uur per week)',
      assessment: 'Eindproject (70%) + Tussentijdse opdrachten (30%)'
    },
    {
      id: 2,
      title: 'Data Science & Analytics',
      description: 'Ontdek de wereld van data analyse, machine learning en visualisatie.',
      fullDescription: 'Deze module biedt een grondige introductie in data science en analytics. Je leert data te analyseren, patronen te herkennen en voorspellingen te doen met machine learning. Ook leer je data effectief te visualiseren en inzichten te communiceren naar verschillende stakeholders.',
      ects: 5,
      period: 'Periode 1',
      category: 'Data',
      prerequisites: 'Statistiek en Python kennis',
      learningGoals: [
        'Data analyseren met Python en pandas',
        'Machine learning modellen bouwen en evalueren',
        'Data visualisatie met matplotlib en seaborn',
        'Statistische analyses uitvoeren',
        'Big data concepten begrijpen',
        'Ethische aspecten van data science'
      ],
      teacher: 'Prof. Dr. M. de Vries',
      duration: '8 weken (5 uur per week)',
      assessment: 'Data analyse project (60%) + Presentatie (20%) + Quiz (20%)'
    },
    {
      id: 3,
      title: 'Cloud Infrastructure',
      description: 'Werk met cloud platforms zoals AWS, Azure en leer over DevOps praktijken.',
      fullDescription: 'In deze module leer je werken met cloud infrastructuur en DevOps praktijken. Je krijgt hands-on ervaring met platforms zoals AWS en Azure, en je leert hoe je applicaties schaalt, beveiligt en monitort in de cloud.',
      ects: 5,
      period: 'Periode 2',
      category: 'Infrastructure',
      prerequisites: 'Linux basics en netwerken kennis',
      learningGoals: [
        'Cloud services configureren op AWS/Azure',
        'CI/CD pipelines opzetten met GitLab/GitHub Actions',
        'Infrastructure as Code met Terraform',
        'Container orchestration met Kubernetes',
        'Monitoring en logging implementeren',
        'Security best practices in de cloud'
      ],
      teacher: 'Ing. P. Janssen',
      duration: '8 weken (6 uur per week)',
      assessment: 'Cloud infrastructuur project (80%) + Technisch verslag (20%)'
    },
    {
      id: 4,
      title: 'Mobile App Development',
      description: 'Bouw native en cross-platform mobiele applicaties voor iOS en Android.',
      fullDescription: 'Deze module richt zich op het ontwikkelen van mobiele applicaties. Je leert native apps bouwen voor iOS en Android, en je ontdekt cross-platform frameworks zoals React Native of Flutter. Ook komen mobile-specifieke UI/UX patterns aan bod.',
      ects: 5,
      period: 'Periode 2',
      category: 'Development',
      prerequisites: 'Object georiënteerd programmeren',
      learningGoals: [
        'Native mobile apps ontwikkelen (iOS/Android)',
        'Cross-platform frameworks gebruiken (React Native/Flutter)',
        'Mobile UI/UX patterns toepassen',
        'Lokale data opslag implementeren',
        'Push notifications integreren',
        'App publicatie proces doorlopen'
      ],
      teacher: 'Drs. L. Bakker',
      duration: '8 weken (5 uur per week)',
      assessment: 'Mobile app project (75%) + App store publicatie (25%)'
    },
    {
      id: 5,
      title: 'Cybersecurity',
      description: 'Leer over security principes, ethical hacking en bescherming van systemen.',
      fullDescription: 'In deze module leer je over cybersecurity en hoe je systemen kunt beschermen tegen aanvallen. Je krijgt inzicht in veelvoorkomende vulnerabilities en leert ethical hacking technieken om zwakke plekken te identificeren.',
      ects: 5,
      period: 'Periode 3',
      category: 'Security',
      prerequisites: 'Netwerken en besturingssystemen kennis',
      learningGoals: [
        'Security vulnerabilities identificeren (OWASP Top 10)',
        'Penetration testing uitvoeren',
        'Beveiligingsmaatregelen implementeren',
        'Cryptografie principes toepassen',
        'Security incident response',
        'Compliance en privacy (AVG/GDPR)'
      ],
      teacher: 'Dr. R. Smit',
      duration: '8 weken (5 uur per week)',
      assessment: 'Penetration test rapport (50%) + Security audit (30%) + Presentatie (20%)'
    },
    {
      id: 6,
      title: 'UX/UI Design',
      description: 'Ontwerp gebruiksvriendelijke interfaces en leer over user experience research.',
      fullDescription: 'Deze module gaat over het ontwerpen van gebruiksvriendelijke interfaces. Je leert user research uit te voeren, wireframes en prototypes te maken, en usability testing toe te passen. Ook leer je design systems en toegankelijkheid.',
      ects: 5,
      period: 'Periode 3',
      category: 'Design',
      prerequisites: 'Basis design kennis',
      learningGoals: [
        'User research uitvoeren (interviews, surveys, personas)',
        'Wireframes en prototypes maken met Figma',
        'Usability testing toepassen',
        'Design systems ontwikkelen',
        'Toegankelijkheid (WCAG) implementeren',
        'Design thinking methodologie'
      ],
      teacher: 'Mevr. S. de Groot',
      duration: '8 weken (4 uur per week)',
      assessment: 'Design project (60%) + Portfolio (20%) + Usability test rapport (20%)'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      const foundModule = this.modules.find(m => m.id === id);

      if (foundModule) {
        this.module.set(foundModule);
      } else {
        // Module not found, redirect to modules list
        this.router.navigate(['/modules']);
      }

      this.loading.set(false);
    });
  }

  protected enrollInModule(): void {
    console.log('Inschrijven voor module:', this.module()?.title);
    // Hier zou je een API call maken om in te schrijven
    alert('Inschrijving succesvol! (Dit is een demo)');
  }
}
