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
      { name: 'Uberhub', logo: 'assets/sponsors/Logo UberHub Site NASA (2).png', url: 'https://uberhub.com.br' },
      { name: 'MTI', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Kn1y5qhpsISjLd_QmdpK3bjzdJSA7iIorA&s', url: 'https://www.mti.work' },
      { name: 'MIT', logo: 'https://m.media-amazon.com/images/I/41VZYP49LiL._UF894,1000_QL80_.jpg', url: 'https://web.mit.edu' },
      { name: 'Harvard', logo: 'https://images.seeklogo.com/logo-png/28/1/harvard-university-logo-png_seeklogo-284458.png', url: 'https://www.harvard.edu' },
      { name: 'Goddard Space Flight Center', logo: 'https://yt3.googleusercontent.com/EJZ484Y7xcwd36EuhEch1x-nwH5I0YkQ3PSSDCxNOebH4N8zaiQtTI6h3fHAsNfTHiSzJ1uaVWg=s900-c-k-c0x00ffffff-no-rj', url: 'https://www.nasa.gov/goddard/' },
      { name: 'Google', logo: 'https://images.seeklogo.com/logo-png/27/1/google-logo-png_seeklogo-273191.png', url: 'https://www.google.com' },
      { name: 'Ifood', logo: 'https://static.ifood.com.br/webapp/images/logo-smile-512x512.png', url: 'https://www.ifood.com.br' },
      { name: 'Santander', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyldeRZdWVUtcV4pSSeJzQfKezzu1Q1qGt8w&s', url: 'https://www.santander.com.br' },
      { name: 'NVIDIA', logo: 'https://store-images.s-microsoft.com/image/apps.2971.13599037783181022.b05b7adf-6b7a-44ae-9a70-9dc9370ea7e6.1a5616ff-237c-407f-a1b2-c07e10ac7c04', url: 'https://www.nvidia.com/pt-br' },
      { name: 'Oracle', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOVjTWaheo4E99cgYZ6y14tpsgHlm0VN8Hw&s', url: 'https://www.oracle.com/br' },
      { name: 'LangFlow', logo: 'https://pbs.twimg.com/profile_images/1906737039724400640/aUuTetdY_400x400.jpg', url: 'https://www.langflow.org' },
      { name: 'Biofy Agro', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFb8Al4G5F5Pw/company-logo_200_200/company-logo_200_200/0/1732554690456/biofyagro_logo?e=2147483647&v=beta&t=gFqI_Vek54CmtWN4N8NV-m7CkDJW2bKjL7L0JLL-SXA', url: 'https://biofyagro.com.br' },
      { name: 'Snowflake', logo: 'https://images.seeklogo.com/logo-png/33/1/snowflake-logo-png_seeklogo-336501.png', url: 'https://www.snowflake.com/pt_br' },
      { name: 'Global Shapers Community', logo: 'assets/sponsors/Global Shapers Community.jpg', url: 'https://www.instagram.com/globalshapersuberlandia' },
      { name: 'Ververica', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBwUyiWy2T6GQIuecRhAhEucPa38MvgsEJw&s', url: 'https://www.ververica.com' },
      { name: 'Bizu Space', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7kR9ABFunhuP5EPW8HagIA1vhVXlWwvswzg&s', url: 'https://www.bizu.space' },
      { name: 'Geração de Marte', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMnfGx6ZKspT3Iln4YBFTXYab0O7ji42Tlig&s', url: 'https://www.instagram.com/geracao.de.marte' },
      { name: 'UFMG', logo: 'https://images.seeklogo.com/logo-png/19/1/ufmg-logo-png_seeklogo-193610.png', url: 'https://www.instagram.com/ufmg' },
      { name: 'Alter', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGyhLjeUvvQ3w/company-logo_200_200/company-logo_200_200/0/1685957936806?e=1758758400&v=beta&t=o-zkdDVuNPhHELg1VGnjZLJVhOsUsIpV1Rfv-4X8McQ', url: 'https://www.alterconteudo.com.br/' },
      { name: 'GRVA', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQH5NIuzpkwyJw/company-logo_200_200/company-logo_200_200/0/1630576065144?e=2147483647&v=beta&t=og3l0xiFg4m_h1ZtJcQO2CcIkVK6ucDcXhZuAYfg_-Q', url: 'https://grva.com.br/' },
      { name: 'Ntropy', logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFOOJ88vk2SUg/company-logo_200_200/company-logo_200_200/0/1685457284078/ntropy_logo?e=1758758400&v=beta&t=g13Dudn03gQHjxsFvpizJzTMYjYvg03mWGtXKewzkzg', url: 'https://www.ntropy.com/' },
      { name: 'Agro Smart', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQH44jdcui91xA/company-logo_200_200/company-logo_200_200/0/1657037642094/agrosmart_logo?e=2147483647&v=beta&t=uKD3P6woxuauHHnSu2Ir-xijngQMkZJHJZf6ULgxSWo', url: 'https://agrosmart.com.br/' },
    ]
  };
}
