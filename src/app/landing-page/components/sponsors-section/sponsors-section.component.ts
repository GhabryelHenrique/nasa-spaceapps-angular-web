import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sponsors-section',
  imports: [CommonModule],
  templateUrl: './sponsors-section.component.html',
  styleUrl: './sponsors-section.component.scss'
})
export class SponsorsSectionComponent {
  sponsors = {
    diamond: [
      { name: 'NASA', logo: 'assets/nasa-spaceapps-logo-removebg-preview.png', url: 'https://spaceappschallenge.org' },
    ],
    // gold: [
    //   { name: 'Uberlândia Prefeitura', logo: 'assets/sponsors/prefeitura-logo.png', url: '#' },
    //   { name: 'UFU', logo: 'assets/sponsors/ufu-logo.png', url: 'https://ufu.br' },
    // ],
    // silver: [
    //   { name: 'FIEMG', logo: 'assets/sponsors/fiemg-logo.png', url: '#' },
    //   { name: 'SEBRAE', logo: 'assets/sponsors/sebrae-logo.png', url: '#' },
    //   { name: 'CDL Uberlândia', logo: 'assets/sponsors/cdl-logo.png', url: '#' },
    // ],
    // bronze: [
    //   { name: 'Empresa 1', logo: 'assets/sponsors/empresa1-logo.png', url: '#' },
    //   { name: 'Empresa 2', logo: 'assets/sponsors/empresa2-logo.png', url: '#' },
    //   { name: 'Empresa 3', logo: 'assets/sponsors/empresa3-logo.png', url: '#' },
    //   { name: 'Empresa 4', logo: 'assets/sponsors/empresa4-logo.png', url: '#' },
    // ],
    supporters: [
      { name: 'UFU', logo: 'https://images.seeklogo.com/logo-png/23/1/ufu-logo-png_seeklogo-238178.png', url: 'https://www.instagram.com/ufu_oficial/?hl=pt-br' },
      { name: 'MTI', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Kn1y5qhpsISjLd_QmdpK3bjzdJSA7iIorA&s', url: 'https://www.mti.work' },
      { name: 'MIT', logo: 'https://m.media-amazon.com/images/I/41VZYP49LiL._UF894,1000_QL80_.jpg', url: 'https://web.mit.edu' },
      { name: 'Harvard', logo: 'https://images.seeklogo.com/logo-png/28/1/harvard-university-logo-png_seeklogo-284458.png', url: 'https://www.harvard.edu' },
      { name: 'Google', logo: 'https://images.seeklogo.com/logo-png/27/1/google-logo-png_seeklogo-273191.png', url: 'https://www.google.com' },
      { name: 'Ifood', logo: 'https://static.ifood.com.br/webapp/images/logo-smile-512x512.png', url: 'https://www.ifood.com.br' },
      { name: 'Uberhub', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQHJfk7zGWfy-A/company-logo_200_200/company-logo_200_200/0/1630575695438?e=2147483647&v=beta&t=4Hrp7xicuchNKYyVQsllWkrGdfxRg4MCzLAdcyjjxME', url: 'https://uberhub.com.br' },
      { name: 'NVIDIA', logo: 'https://store-images.s-microsoft.com/image/apps.2971.13599037783181022.b05b7adf-6b7a-44ae-9a70-9dc9370ea7e6.1a5616ff-237c-407f-a1b2-c07e10ac7c04', url: 'https://www.nvidia.com/pt-br' },
      { name: 'Oracle', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOVjTWaheo4E99cgYZ6y14tpsgHlm0VN8Hw&s', url: 'https://www.oracle.com/br' },
      { name: 'LangFlow', logo: 'https://pbs.twimg.com/profile_images/1906737039724400640/aUuTetdY_400x400.jpg', url: 'https://www.langflow.org' },
      { name: 'Biofy Agro', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFb8Al4G5F5Pw/company-logo_200_200/company-logo_200_200/0/1732554690456/biofyagro_logo?e=2147483647&v=beta&t=gFqI_Vek54CmtWN4N8NV-m7CkDJW2bKjL7L0JLL-SXA', url: 'https://biofyagro.com.br' },
      { name: 'Snowflake', logo: 'https://images.seeklogo.com/logo-png/33/1/snowflake-logo-png_seeklogo-336501.png', url: 'https://www.snowflake.com/pt_br' },
      { name: 'Global Shapers Community', logo: 'assets/sponsors/Global Shapers Community.jpg', url: 'https://www.instagram.com/globalshapersuberlandia' },
      { name: 'Ververica', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBwUyiWy2T6GQIuecRhAhEucPa38MvgsEJw&s', url: 'https://www.ververica.com' },
    ]
  };
}
