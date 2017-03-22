export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';

export interface Profile {
  name?: string;
  picture?: string;
  pictureId?: string;
  description?: string;
}

export enum MessageType {
  TEXT = <any>'text',
  LOCATION = <any>'location',
  PICTURE = <any>'picture'
}

export interface Chat {
  _id?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
  memberIds?: string[];
}

export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  content?: string;
  createdAt?: Date;
  type?: MessageType
  ownership?: string;
}

export interface User extends Meteor.User {
  profile?: Profile;
}

export interface Location {
  lat: number;
  lng: number;
  zoom: number;
}

export interface Picture {
  _id?: string;
  complete?: boolean;
  extension?: string;
  name?: string;
  progress?: number;
  size?: number;
  store?: string;
  token?: string;
  type?: string;
  uploadedAt?: Date;
  uploading?: boolean;
  url?: string;
  userId?: string;
}

export interface Event {
  _id?: string;
  complete?: boolean;
  name?: string;
  description?: string;
  dateStart?: string;
  dateEnd?: string;
  creatorId?: string;
  picture?: string;
  pictureId?: string;
  location?: string;
  subscribers? : string[];
  iGoSubscribers? : string[];
  countSubscribers: number;
  countIGoSubscribers: number;
  countOfComments: number;
  creatorName?: string;
  creatorAvatar? :string;
}

export interface Comment {
  _id?: string;
  creatorId?: string;
  text?: string;
  createdAt?: string;
  docId?: string;
  username?: string;
  avatar?: string;
}
