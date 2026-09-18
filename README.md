# Auravox — Conceito 3D interativo de fone de ouvido

Projeto **conceitual e não oficial**, sem vínculo com a Apple. Nenhuma
especificação técnica real é reivindicada — todos os textos técnicos são
genéricos/ilustrativos.

Site de apresentação de produto com uma experiência 3D interativa guiada por
scroll: rotação livre com mouse/toque, zoom, desmontagem em etapas, vista
explodida com hotspots clicáveis e remontagem final.

## Stack

- React 18 + TypeScript
- Vite
- Three.js + React Three Fiber + @react-three/drei
- Framer Motion (animações de entrada dos textos)

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos finais ficam em `dist/`.

## Estrutura do projeto

```
src/
  data/            textos e configuração da linha do tempo (fora dos componentes)
  hooks/           hooks reutilizáveis (mobile, movimento reduzido, cursor)
  utils/           funções auxiliares (easing/bandas de progresso)
  three/           cena 3D: modelo procedural, hotspots, câmera e efeitos
  components/      seções e elementos de interface (DOM)
  styles/          CSS global
public/models/     onde colocar um modelo GLB/GLTF real (opcional)
```

## Modelo 3D

Por padrão o fone é **gerado proceduralmente em código** (sem depender de um
arquivo externo), com peças separadas (carcaça, driver, microfones, bateria,
placa, chip, sensores e antena) que se movem na vista explodida. Se você tiver
um modelo real em `.glb`/`.gltf`, pode substituí-lo em
`src/three/EarbudModel.tsx` e colocar o arquivo em `public/models/`.

## Interações

- **Mouse (desktop):** arraste para girar o produto livremente; role a página
  para conduzir a experiência cinematográfica (rotação, zoom, desmontagem,
  vista explodida, remontagem).
- **Toque (mobile):** arraste para girar; pinça com dois dedos para
  aproximar/afastar a câmera; deslize a tela para navegar pelas seções.
- **Vista explodida:** passe o mouse ou toque em uma peça para destacá-la;
  clique/toque para abrir o painel com a descrição.

## Acessibilidade

- Navegação por teclado e `aria-label`s nos controles principais.
- Botão "Reduzir animações" no canto superior esquerdo, que respeita também a
  preferência do sistema (`prefers-reduced-motion`).
- Contraste de texto verificado no tema claro.
- Fallback textual simples caso o navegador não suporte WebGL.

## Performance

- DPR adaptativo (`AdaptiveDpr`) e resolução mais baixa em mobile.
- Ambiente de iluminação (`Environment`) carregado sob `Suspense`, com tela de
  carregamento própria.
- Modelo procedural leve (geometrias primitivas), sem texturas pesadas.
