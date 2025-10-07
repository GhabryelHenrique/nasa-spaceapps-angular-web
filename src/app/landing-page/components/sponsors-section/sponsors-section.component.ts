import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sponsors-section',
  imports: [CommonModule],
  templateUrl: './sponsors-section.component.html',
  styleUrl: './sponsors-section.component.scss'
})
export class SponsorsSectionComponent implements OnDestroy {
  sponsors = {
    diamond: [
      { name: 'NASA', logo: 'assets/nasa-spaceapps-logo-removebg-preview.png', url: 'https://spaceappschallenge.org' },
    ],
    gold: [
      { name: 'Uberhub', logo: 'assets/sponsors/Logo UberHub Site NASA (2).png', url: 'https://uberhub.com.br' },
      { name: 'MTI', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Kn1y5qhpsISjLd_QmdpK3bjzdJSA7iIorA&s', url: 'https://www.mti.work' },
      { name: 'Redbull', logo: 'https://i.pinimg.com/736x/ec/d1/bf/ecd1bf4aa8781e0e4761106cebffce16.jpg', url: 'https://www.redbull.com/br-pt' },
      { name: 'Una', logo: 'assets/sponsors/UNA.png', url: 'https://www.una.br/' },
      { name: 'Uniube', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbtsF1sr5Ux8i3o-lcTy3mMkx8M2yrIAi-hg&s', url: 'https://uniube.br/' },
      { name: 'Asa Digital', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1-vLv961Oyxnxn4HzlDrF52q2-RPxfa1KJg&s', url: 'https://www.asacoworking.com' },
      { name: 'Sankhya', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTopm6OtBBoiGdqE2Nkmjoat8B8FC1Iyy2LKg&s', url: 'https://www.sankhya.com.br/' },
      { name: 'UFU', logo: 'https://images.seeklogo.com/logo-png/23/1/ufu-logo-png_seeklogo-238178.png', url: 'https://www.instagram.com/ufu_oficial/?hl=pt-br' },
      { name: 'IFTM', logo: 'https://iftm.edu.br/bdt/img/logo_iftm.png', url: 'https://www.uemg.br' },
      { name: 'Colégio Ann Mackenzie', logo: 'assets/sponsors/makense.png', url: 'https://colegioannmackenzie.com.br' },
      { name: 'Colégio Nacional', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb3M1nAsCBCfXybnCaHbRNy_xyncy35dDAiw&s', url: 'https://www.nacionalnet.com.br' },
      { name: 'Oracle', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOVjTWaheo4E99cgYZ6y14tpsgHlm0VN8Hw&s', url: 'https://www.oracle.com/br' },
      { name: 'Colégio Gabarito', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwGgksxpwDoLa0Omi11PVWdvOCZxrireXLBS26GdhHY0THxb5OvuAXwijoUU7nT4reQKs&usqp=CAU', url: 'https://gabaritoeducacao.com' },
      { name: 'Instituto Projeto de Vida', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgoUx2wUbksg5R3ro6o_29riVp6REWXxzIFA&s', url: 'https://institutoprojetodevida.org/' },
      { name: 'Global Shapers Community', logo: 'assets/sponsors/Global Shapers Community.jpg', url: 'https://www.instagram.com/globalshapersuberlandia' },
    ],
    silver: [
      { name: 'MFlab', logo: 'assets/sponsors/mf-lab.jpg', url: 'https://www.femec.ufu.br/unidades/laboratorio/laboratorio-de-mecanica-dos-fluidos' },
      { name: 'CyberGênios', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQHnUHvaBmKirA/company-logo_200_200/company-logo_200_200/0/1630577378260/cybergenio_logo?e=2147483647&v=beta&t=ATGlQTB3WPRqJnBqVgcUi11X0YJttNRosSdtsl7BRqY', url: 'https://cybergenios.com.br' },
      { name: '+ Meninas Tech', logo: 'assets/sponsors/maisMeninasTech.png', url: 'https://www.instagram.com/maismeninastech' },
    ],
    supporters: [
      { name: 'MIT', logo: 'https://m.media-amazon.com/images/I/41VZYP49LiL._UF894,1000_QL80_.jpg', url: 'https://web.mit.edu' },
      { name: 'Goddard Space Flight Center', logo: 'assets/sponsors/channels4_profile.jpg', url: 'https://www.nasa.gov/goddard/' },
      { name: 'IBM', logo: 'https://t.ctcdn.com.br/JA0gFhmfATSkDmbe7ITbkIzToa0=/i654119.png', url: 'https://www.ibm.com/br-pt' },
      { name: 'NVIDIA', logo: 'https://store-images.s-microsoft.com/image/apps.2971.13599037783181022.b05b7adf-6b7a-44ae-9a70-9dc9370ea7e6.1a5616ff-237c-407f-a1b2-c07e10ac7c04', url: 'https://www.nvidia.com/pt-br' },
      { name: 'Google', logo: 'https://images.seeklogo.com/logo-png/27/1/google-logo-png_seeklogo-273191.png', url: 'https://www.google.com' },
      { name: 'Tata Consultancy Services', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGsGR9p4ikS5w/company-logo_200_200/company-logo_200_200/0/1708946550425/tata_consultancy_services_logo?e=1759968000&v=beta&t=dUdTwgFYAKekff6cZ3FzP95KV88kETq1l8GCZRTd02A', url: 'https://www.tcs.com' },
      { name: 'Logbit', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGoKgrGKgrSIQ/company-logo_200_200/company-logo_200_200/0/1734106214792/logbit_logo?e=1759968000&v=beta&t=4IiOCSJZ-z3VP16k6pD8WHFszo0Mz-1sz7faNblnf-U', url: 'https://logbit.com.br/areacolab.html' },
      { name: 'Neppo', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHi_a5oi7IigQ/company-logo_200_200/company-logo_200_200/0/1710872636958/neppo_tecnologia_logo?e=1759968000&v=beta&t=IvrqZ5VMwjYj7PX_GwQCddPNmTLHqKf3YzJ3GqxFDzg', url: 'https://neppo.com.br' },
      { name: 'Harvard', logo: 'https://images.seeklogo.com/logo-png/28/1/harvard-university-logo-png_seeklogo-284458.png', url: 'https://www.harvard.edu' },
      { name: 'USP', logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEEty1xF9jFog/company-logo_200_200/B4EZVMm.k3HMAU-/0/1740747041633/uspoficial_logo?e=2147483647&v=beta&t=2wo2exdbRWHbHUYlK9pzchZ4liW6Hf-zoiNxz_Sh_58', url: 'https://www5.usp.br' },
      { name: 'UFMG', logo: 'https://images.seeklogo.com/logo-png/19/1/ufmg-logo-png_seeklogo-193610.png', url: 'https://www.instagram.com/ufmg' },
      { name: 'UEMG', logo: 'https://ed.uemg.br/wp-content/uploads/2018/12/favicon.png', url: 'https://www.iftm.edu.br' },
      { name: 'Unitri', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZsCrwIQwv_WcH_4yRpg5j5FQfPoickMMirw&s', url: 'https://www.unitri.edu.br' },
      { name: 'UNIFACS', logo: 'https://strixeducacao.com.br/wp-content/uploads/2024/08/LOGO_UNIFACS_SITE.jpg', url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjrnPGMzauPAxXTILkGHbC4KIYQFnoECA0QAQ&url=https%3A%2F%2Fwww.unifacs.br%2F&usg=AOvVaw3i19KB3mL9ROKIm_QW9MfQ&opi=89978449' },
      { name: 'LASSU-USP', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNVo_AtDnOJfedx3gNg-Qh0giyuP3dNrMAA&s', url: 'https://www.lassu.usp.br/?doing_wp_cron=1756318949.9659340381622314453125' },
      { name: 'Unitri', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZsCrwIQwv_WcH_4yRpg5j5FQfPoickMMirw&s', url: 'https://www.unitri.edu.br' },
      { name: 'Ifood', logo: 'https://static.ifood.com.br/webapp/images/logo-smile-512x512.png', url: 'https://www.ifood.com.br' },
      { name: 'Itaú', logo: 'https://play-lh.googleusercontent.com/gRcutACE4XkEHmxcbUdOehxpTbp_LjmwJ6qIEbqfD34oh9feTNhTnlDgf97HEZ9eGKY=s256-rw', url: 'https://www.itau.com.br' },
      { name: 'Zup Innovation', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRotJvZVHcO3WhugTZAEvPvrm0eJDfo7J8iOQ&s', url: 'https://zup.com.br/' },
      { name: 'Neppo', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRSXytbvom-2xUIcP9vNNPfpGKOTgunVRo1A&s', url: 'https://neppo.com.br/' },
      { name: 'Brain', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOTTjjaMnLdAln0y6CoY2YSCqr3nYeQVzPPQ&s', url: 'https://inovacaobrain.com.br' },
      { name: 'Santander', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyldeRZdWVUtcV4pSSeJzQfKezzu1Q1qGt8w&s', url: 'https://www.santander.com.br' },
      { name: 'Bradesco', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDNVTc3mhbojIWSX9gonGIPaDetl3AhP66kA&s', url: 'https://banco.bradesco/marca/' },
      { name: 'Sest Senat', logo: 'https://yt3.googleusercontent.com/ttSDv6723Ku305iljYWHDRXekiPtDDBZt61686psLLmQLoPv-7VI2feQWAlyeOTOvL2NBNDHwQ=s900-c-k-c0x00ffffff-no-rj', url: 'https://www.sestsenat.org.br/home' },
      { name: 'DMAE', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh8w2ZaPgHcSGZeSKTYX2T4_x29-fUZyuqTg&s', url: 'https://www.uberlandia.mg.gov.br/prefeitura/orgaos-municipais/dmae' },
      { name: 'LangFlow', logo: 'https://pbs.twimg.com/profile_images/1906737039724400640/aUuTetdY_400x400.jpg', url: 'https://www.langflow.org' },
      { name: 'Algar Tech', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdelhd5ZpYGkiuhL2WYfoNdKe9JY0X35f04A&s', url: 'https://www.langflow.org' },
      { name: 'Snowflake', logo: 'https://images.seeklogo.com/logo-png/33/1/snowflake-logo-png_seeklogo-336501.png', url: 'https://www.snowflake.com/pt_br' },
      { name: 'Bizu Space', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7kR9ABFunhuP5EPW8HagIA1vhVXlWwvswzg&s', url: 'https://www.bizu.space' },
      { name: 'Geração de Marte', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMnfGx6ZKspT3Iln4YBFTXYab0O7ji42Tlig&s', url: 'https://www.instagram.com/geracao.de.marte' },
      { name: 'Alter', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGyhLjeUvvQ3w/company-logo_200_200/company-logo_200_200/0/1685957936806?e=1762387200&v=beta&t=UrXsGLV7RXnyUz-O8Lsbirx9mJZEl4Lt8biA5e-0Elc', url: 'https://www.alterconteudo.com.br/' },
      { name: 'GRVA', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQH5NIuzpkwyJw/company-logo_200_200/company-logo_200_200/0/1630576065144?e=2147483647&v=beta&t=og3l0xiFg4m_h1ZtJcQO2CcIkVK6ucDcXhZuAYfg_-Q', url: 'https://grva.com.br/' },
      { name: 'Ntropy', logo: 'https://ffnews.com/wp-content/uploads/2023/06/ntropy-149x149.jpg', url: 'https://www.ntropy.com/' },
      { name: 'Aimirim', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQE5wUH84mceMA/company-logo_200_200/company-logo_200_200/0/1630707182957/aimirim_solues_tecnolgicas_integradas_ltda__logo?e=1759968000&v=beta&t=TMUV2BK2zUCvHnkgl1l6KMp4ILlf3w7JHkYXseWJyXU', url: 'https://www.aimirimsti.com.br' },
      { name: 'Agro Smart', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQH44jdcui91xA/company-logo_200_200/company-logo_200_200/0/1657037642094/agrosmart_logo?e=2147483647&v=beta&t=uKD3P6woxuauHHnSu2Ir-xijngQMkZJHJZf6ULgxSWo', url: 'https://agrosmart.com.br/' },
      { name: 'LayerX', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHZQ8yCJxxisQ/company-logo_200_200/company-logo_200_200/0/1734982286382/layerxsolucoes_logo?e=1759968000&v=beta&t=F756UStC-NSvBRmcEbT2vRK8QKv0xXKl8go0_ylSw8U', url: 'https://layerx.com.br' },
      { name: 'Observatório Nacional', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFVZtnLQKrmNg/company-logo_200_200/company-logo_200_200/0/1631356595002?e=2147483647&v=beta&t=ONLM2nZjv3fbTw7420qtgQhwiC1ef13bkhIMRscBlaE', url: 'https://www.gov.br/observatorio/pt-br' },
      { name: 'CMCC Foundation', logo: 'https://media.licdn.com/dms/image/v2/C560BAQGVE_6icH6sTg/company-logo_200_200/company-logo_200_200/0/1673359113519/cmccfoundation_logo?e=1759968000&v=beta&t=U9JcKHUFyqqHOWhhzTy5emTpx1-_qoTEW7-zgfUuxu0', url: 'https://www.cmcc.it' },
      { name: 'Rede de Ensino e Pesquisa', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFbfp7mW4TEkA/company-logo_200_200/company-logo_200_200/0/1662129972806/redernp_logo?e=2147483647&v=beta&t=s2uVsmm_0aq1DaFp_aTtl0sdOEsbRRoJZMJVZFazYyA', url: 'https://www.rnp.br' },
      { name: 'Empreendedorismo Ambiental', logo: 'assets/sponsors/emprendendorismo.jpg', url: 'https://www.rnp.br' },
    ]
  };

private hoverTimeout: any;
  private audio: HTMLAudioElement | null = null;
  private animationInterval: any;
  showEasterEgg = false;
  isPartyMode = false;

  startHover(sponsorName: string) {
    this.hoverTimeout = setTimeout(() => {
      if (sponsorName.toLowerCase() === 'redbull') {
        this.showEasterEgg = true; // mostra botão escondido
      }
    }, 10000); // 1 min e 4s
  }

  stopHover() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.showEasterEgg = false;
  }

  playMusic() {
    if (this.isPartyMode) {
      this.stopPartyMode();
      return;
    }

    this.isPartyMode = true;
    this.audio = new Audio('assets/33-max.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.7;

    // Adiciona classes para animação global
    document.body.classList.add('red-bull-party-mode');

    // Inicia as animações rítmicas
    this.startRhythmicAnimations();

    this.audio.play().catch(console.error);

    // Para automaticamente após 30 segundos
    setTimeout(() => {
      if (this.isPartyMode) {
        this.stopPartyMode();
      }
    }, 30000);
  }

  private startRhythmicAnimations() {
    let beatCount = 0;

    // Simula batidas da música (BPM ~128, então ~469ms por batida)
    this.animationInterval = setInterval(() => {
      beatCount++;

      // Adiciona pulse nas batidas principais
      if (beatCount % 4 === 0) {
        document.body.classList.add('mega-beat');
        setTimeout(() => document.body.classList.remove('mega-beat'), 200);
      } else {
        document.body.classList.add('beat-pulse');
        setTimeout(() => document.body.classList.remove('beat-pulse'), 150);
      }

      // Efeitos especiais a cada 8 batidas
      if (beatCount % 8 === 0) {
        this.createSparkleEffect();
      }

      // Mudança de cor do background a cada 16 batidas
      if (beatCount % 16 === 0) {
        document.body.classList.add('color-shift');
        setTimeout(() => document.body.classList.remove('color-shift'), 500);
      }

    }, 469); // ~128 BPM
  }

  private createSparkleEffect() {
    const sparkles = document.createElement('div');
    sparkles.className = 'red-bull-sparkles';
    sparkles.innerHTML = '⚡✨🏎️⚡✨🏎️⚡✨';
    document.body.appendChild(sparkles);

    setTimeout(() => {
      if (sparkles.parentNode) {
        sparkles.parentNode.removeChild(sparkles);
      }
    }, 2000);
  }

  private stopPartyMode() {
    this.isPartyMode = false;

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    // Remove todas as classes de animação
    document.body.classList.remove('red-bull-party-mode', 'beat-pulse', 'mega-beat', 'color-shift');

    // Remove qualquer sparkle restante
    const sparkles = document.querySelectorAll('.red-bull-sparkles');
    sparkles.forEach(sparkle => sparkle.remove());
  }

  ngOnDestroy() {
    this.stopPartyMode();
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }
}
