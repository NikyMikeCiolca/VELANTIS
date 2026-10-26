export interface track {
    id: string;
    title: string;
    artist: string;
    src: string;
    bpm?: number;
    energy?: 1 | 2 | 3 | 4 | 5;
}

export const TRACKS: readonly track[] = [
    {id: 'im-not-alone', title: 'Im Not Alone (2019 Remix)', artist: 'Calvin Harris', src:'/audio/calvin-harris-im-not-alone.mp3'},
    {id: 'i-cry', title: 'I Cry', artist: 'Flo Rida', src:'/audio/flo-rida-i-cry.mp3'},
    {id: 'she-wolf', title: 'She Wolf', artist: 'Shakira', src: '/audio/shakira-she-wolf.mp3'},
    {id: 'wild-ones', title: 'Wild Ones', artist: 'Flo Rida & Sia', src: '/audio/flo-rida-wild-ones.mp3'},
    {id: 'thinking-about-you', title:'Thinking About You', artist: 'Calvin Harris', src: '/audio/calvin-harris-thinking-about-you.mp3'},
    {id: 'mirage', title: 'Mirage', artist: 'MPH & Skrillex', src: '/audio/mirage.mp3'},
    {id: 'free-your-mind', title:'Free Your Mind', artist: 'Prospa, Cloonee & Sybil', src: '/audio/prospa-cloonee-sybil-free-your-mind.mp3'},
    {id: 'on-2nite', title: 'On 2nite', artist: 'Silva Bumpa', src: '/audio/silva-bumpa-on-2nite.mp3'},
    {id: 'say-my-name-remix', title: 'Say My Name (Calvin Harris Remix)', artist: 'Florence + The Machine, Calvin Harris', src: '/audio/florence-the-machine-spectrum-(say-my-name)-(calvin-harris-remix).mp3'},
    {id: 'years-and-years', title: 'Years & Years', artist: 'King', src: '/audio/years-and-years-king.mp3'},
    {id: 'you-know-you-like-it', title: 'You Know You Like It (Tchami Remix)', artist: 'AlunaGeorge & Tchami', src: '/audio/alunageorge-you-know-you-like-it-(tchami-remix).mp3'},
]
