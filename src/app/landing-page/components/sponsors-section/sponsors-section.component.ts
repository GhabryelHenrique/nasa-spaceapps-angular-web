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
      { name: 'Goddard Space Flight Center', logo: 'assets/sponsors/channels4_profile.jpg', url: 'https://www.nasa.gov/goddard/' },
      { name: 'IBM', logo: 'https://media.licdn.com/dms/image/v2/D560BAQGiz5ecgpCtkA/company-logo_200_200/company-logo_200_200/0/1688684715866/ibm_logo?e=1758758400&v=beta&t=HsAybzR97WqPtVfmo0GwYLU0WZpYdbQyGMFe1EG0E2s', url: 'https://www.nasa.gov/goddard/' },
      { name: 'Global Shapers Community', logo: 'assets/sponsors/Global Shapers Community.jpg', url: 'https://www.instagram.com/globalshapersuberlandia' },
      { name: 'NVIDIA', logo: 'https://store-images.s-microsoft.com/image/apps.2971.13599037783181022.b05b7adf-6b7a-44ae-9a70-9dc9370ea7e6.1a5616ff-237c-407f-a1b2-c07e10ac7c04', url: 'https://www.nvidia.com/pt-br' },
      { name: 'Oracle', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOVjTWaheo4E99cgYZ6y14tpsgHlm0VN8Hw&s', url: 'https://www.oracle.com/br' },
      { name: 'Google', logo: 'https://images.seeklogo.com/logo-png/27/1/google-logo-png_seeklogo-273191.png', url: 'https://www.google.com' },
      { name: 'Harvard', logo: 'https://images.seeklogo.com/logo-png/28/1/harvard-university-logo-png_seeklogo-284458.png', url: 'https://www.harvard.edu' },
      { name: 'USP', logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEEty1xF9jFog/company-logo_200_200/B4EZVMm.k3HMAU-/0/1740747041633/uspoficial_logo?e=2147483647&v=beta&t=2wo2exdbRWHbHUYlK9pzchZ4liW6Hf-zoiNxz_Sh_58', url: 'https://www5.usp.br' },
      { name: 'UFMG', logo: 'https://images.seeklogo.com/logo-png/19/1/ufmg-logo-png_seeklogo-193610.png', url: 'https://www.instagram.com/ufmg' },
      { name: 'UEMG', logo: 'https://ed.uemg.br/wp-content/uploads/2018/12/favicon.png', url: 'https://www.iftm.edu.br' },
      { name: 'IFTM', logo: 'https://iftm.edu.br/bdt/img/logo_iftm.png', url: 'https://www.uemg.br' },
      { name: 'UNIFACS', logo: 'https://strixeducacao.com.br/wp-content/uploads/2024/08/LOGO_UNIFACS_SITE.jpg', url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjrnPGMzauPAxXTILkGHbC4KIYQFnoECA0QAQ&url=https%3A%2F%2Fwww.unifacs.br%2F&usg=AOvVaw3i19KB3mL9ROKIm_QW9MfQ&opi=89978449' },
      { name: 'LASSU-USP', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNVo_AtDnOJfedx3gNg-Qh0giyuP3dNrMAA&s', url: 'https://www.lassu.usp.br/?doing_wp_cron=1756318949.9659340381622314453125' },
      { name: 'Unitri', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZsCrwIQwv_WcH_4yRpg5j5FQfPoickMMirw&s', url: 'https://www.unitri.edu.br' },
      { name: 'Zup Innovation', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRotJvZVHcO3WhugTZAEvPvrm0eJDfo7J8iOQ&s', url: 'https://zup.com.br/' },
      { name: 'Ifood', logo: 'https://static.ifood.com.br/webapp/images/logo-smile-512x512.png', url: 'https://www.ifood.com.br' },
      { name: 'Itaú', logo: 'https://play-lh.googleusercontent.com/gRcutACE4XkEHmxcbUdOehxpTbp_LjmwJ6qIEbqfD34oh9feTNhTnlDgf97HEZ9eGKY=s256-rw', url: 'https://www.itau.com.br' },
      { name: 'Santander', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyldeRZdWVUtcV4pSSeJzQfKezzu1Q1qGt8w&s', url: 'https://www.santander.com.br' },
      { name: 'Bradesco', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDNVTc3mhbojIWSX9gonGIPaDetl3AhP66kA&s', url: 'https://banco.bradesco/marca/' },
      { name: 'Sest Senat', logo: 'https://yt3.googleusercontent.com/ttSDv6723Ku305iljYWHDRXekiPtDDBZt61686psLLmQLoPv-7VI2feQWAlyeOTOvL2NBNDHwQ=s900-c-k-c0x00ffffff-no-rj', url: 'https://www.sestsenat.org.br/home' },
      { name: 'DMAE', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh8w2ZaPgHcSGZeSKTYX2T4_x29-fUZyuqTg&s', url: 'https://www.uberlandia.mg.gov.br/prefeitura/orgaos-municipais/dmae' },
      { name: 'LangFlow', logo: 'https://pbs.twimg.com/profile_images/1906737039724400640/aUuTetdY_400x400.jpg', url: 'https://www.langflow.org' },
      { name: 'Algar Tech', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdelhd5ZpYGkiuhL2WYfoNdKe9JY0X35f04A&s', url: 'https://www.langflow.org' },
      // { name: 'Biofy Agro', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFb8Al4G5F5Pw/company-logo_200_200/company-logo_200_200/0/1732554690456/biofyagro_logo?e=2147483647&v=beta&t=gFqI_Vek54CmtWN4N8NV-m7CkDJW2bKjL7L0JLL-SXA', url: 'https://biofyagro.com.br' },
      { name: 'Snowflake', logo: 'https://images.seeklogo.com/logo-png/33/1/snowflake-logo-png_seeklogo-336501.png', url: 'https://www.snowflake.com/pt_br' },
      { name: 'Ververica', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBBwUyiWy2T6GQIuecRhAhEucPa38MvgsEJw&s', url: 'https://www.ververica.com' },
      { name: 'Bizu Space', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7kR9ABFunhuP5EPW8HagIA1vhVXlWwvswzg&s', url: 'https://www.bizu.space' },
      { name: 'Geração de Marte', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMnfGx6ZKspT3Iln4YBFTXYab0O7ji42Tlig&s', url: 'https://www.instagram.com/geracao.de.marte' },
      { name: 'Alter', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGyhLjeUvvQ3w/company-logo_200_200/company-logo_200_200/0/1685957936806?e=1758758400&v=beta&t=o-zkdDVuNPhHELg1VGnjZLJVhOsUsIpV1Rfv-4X8McQ', url: 'https://www.alterconteudo.com.br/' },
      { name: 'GRVA', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQH5NIuzpkwyJw/company-logo_200_200/company-logo_200_200/0/1630576065144?e=2147483647&v=beta&t=og3l0xiFg4m_h1ZtJcQO2CcIkVK6ucDcXhZuAYfg_-Q', url: 'https://grva.com.br/' },
      { name: 'Ntropy', logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFOOJ88vk2SUg/company-logo_200_200/company-logo_200_200/0/1685457284078/ntropy_logo?e=1758758400&v=beta&t=g13Dudn03gQHjxsFvpizJzTMYjYvg03mWGtXKewzkzg', url: 'https://www.ntropy.com/' },
      { name: 'Agro Smart', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQH44jdcui91xA/company-logo_200_200/company-logo_200_200/0/1657037642094/agrosmart_logo?e=2147483647&v=beta&t=uKD3P6woxuauHHnSu2Ir-xijngQMkZJHJZf6ULgxSWo', url: 'https://agrosmart.com.br/' },
      { name: 'LayerX', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/3ac3080a6c3f415ba2f312d857fec937', url: 'https://layerxsecurity.com/pt/' },
      { name: 'CyberGênios', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQHnUHvaBmKirA/company-logo_200_200/company-logo_200_200/0/1630577378260/cybergenio_logo?e=2147483647&v=beta&t=ATGlQTB3WPRqJnBqVgcUi11X0YJttNRosSdtsl7BRqY', url: 'https://cybergenios.com.br' },
      { name: 'Portão 3', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQGXXDRmGbF-jQ/company-logo_200_200/company-logo_200_200/0/1630547611880/portao_3_logo?e=2147483647&v=beta&t=f_I13yGu1nwBMN-b-1oZDRmpNqhWxZAFAH9B8U3Z7Qw', url: 'https://portao3.com.br' },
      { name: 'Asa Coworking', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1-vLv961Oyxnxn4HzlDrF52q2-RPxfa1KJg&s', url: 'https://www.asacoworking.com' },
      { name: 'Rede de Ensino e Pesquisa', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFbfp7mW4TEkA/company-logo_200_200/company-logo_200_200/0/1662129972806/redernp_logo?e=2147483647&v=beta&t=s2uVsmm_0aq1DaFp_aTtl0sdOEsbRRoJZMJVZFazYyA', url: 'https://www.rnp.br' },
    ]
  };
}
