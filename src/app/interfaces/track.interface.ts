export interface track {
    id: string;
    title: string;
    artist: string;
    src: string;
    bpm?: number;
    energy?: 1 | 2 | 3 | 4 | 5;
}

export const TRACKS: readonly track[] = [
    {id: 'im-not-alone', title: 'Im not alone', artist: 'Calvin Harris', src:'/audio/calvin-harris-im-not-alone.mp3'},
    {id: 'i-cry', title: 'I cry', artist: 'Flo Rida', src:'/audio/flo-rida-i-cry.mp3'},
    {id: 'sweet-talk', title: 'Sweet Talk', artist: 'Samantha Jade', src: '/audio/sam-jade-sweet-talk.mp3'},
    {id: 'she-wolf', title: 'She Wolf', artist: 'Shakira', src: '/audio/shakira-she-wolf.mp3'},
    {id: 'wild-ones', title: 'Wild ones', artist: 'Flo Rida', src: '/audio/flo-rida-wild-ones.mp3'},
    {id: 'thinking-about-you', title:'Thinking about you', artist: 'Calvin Harris', src: '/audio/calvin-harris-thinking-about-you.mp3'},
    {id: 'work', title: 'Work', artist:'Iggy Azalea', src: '/audio/iggy-work.mp3'},
    {id: 'lean-on', title:'Lean On', artist: 'Major Lazer', src: '/audio/lean-on.mp3'},
]
