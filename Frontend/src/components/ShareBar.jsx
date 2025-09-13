import React from 'react';
import { Share2, Link, Twitter, Facebook, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ShareBar = ({ title, description }) => {
  const { toast } = useToast();

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `${title} - ${description}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link Copied! 📋",
            description: "Share link copied to your clipboard.",
            className: 'bg-blue-600/90 border-blue-500 text-white',
          });
        });
        return;
      default:
        if (navigator.share) {
          navigator.share({ title, text: description, url });
        } else {
          toast({
            title: "🚧 Native Sharing Not Available",
            description: "Please use one of the share options.",
            variant: "destructive"
          });
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4 glass-effect rounded-xl">
        <p className="font-semibold text-white">Share Your Year:</p>
      <Button onClick={() => handleShare('native')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
        <Share2 className="h-4 w-4 mr-2" /> Share
      </Button>
      <Button onClick={() => handleShare('twitter')} size="icon" variant="ghost" className="hover:bg-blue-500/20 text-blue-400"><Twitter className="h-5 w-5" /></Button>
      <Button onClick={() => handleShare('facebook')} size="icon" variant="ghost" className="hover:bg-blue-600/20 text-blue-500"><Facebook className="h-5 w-5" /></Button>
      <Button onClick={() => handleShare('copy')} size="icon" variant="ghost" className="hover:bg-gray-500/20 text-gray-400"><Copy className="h-5 w-5" /></Button>
    </div>
  );
};

export default ShareBar;