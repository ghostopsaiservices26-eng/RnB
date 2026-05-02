import { Component } from '@angular/core';
import { ScrollMorphHeroComponent } from '../../components/scroll-morph-hero/scroll-morph-hero';
import { ProblemSectionComponent } from '../../components/problem-section/problem-section';
import { SolutionSectionComponent } from '../../components/solution-section/solution-section';
import { ProductsSectionComponent } from '../../components/products-section/products-section';
import { DifferenceSectionComponent } from '../../components/difference-section/difference-section';
import { WhyNowSectionComponent } from '../../components/why-now-section/why-now-section';
import { TeamSectionComponent } from '../../components/team-section/team-section';
import { ContactSectionComponent } from '../../components/contact-section/contact-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ScrollMorphHeroComponent,
    ProblemSectionComponent,
    SolutionSectionComponent,
    ProductsSectionComponent,
    DifferenceSectionComponent,
    WhyNowSectionComponent,
    TeamSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <section id="hero" style="height:100vh;">
      <app-scroll-morph-hero style="display:block;width:100%;height:100%;"></app-scroll-morph-hero>
    </section>
    <app-problem-section></app-problem-section>
    <app-solution-section></app-solution-section>
    <app-products-section></app-products-section>
    <app-difference-section></app-difference-section>
    <app-why-now-section></app-why-now-section>
    <app-team-section></app-team-section>
    <app-contact-section></app-contact-section>
  `,
})
export class HomePageComponent {}
