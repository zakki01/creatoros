const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/common/DiscoverView.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update Blog Card Header Actions (Add More Menu, Remove Flag)
const blogHeaderTarget = `                    <div className="flex items-center gap-2">

                      {connectionState === 'connected' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span className="hidden sm:inline">Connected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setConnectTarget({
                              id: post.authorId,
                              name: post.authorName,
                              handle: post.authorHandle,
                              avatar: post.authorAvatar,
                              role: post.authorType,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>`;

const blogHeaderReplacement = `                    <div className="flex items-center gap-2">
                      {connectionState === 'connected' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Connected ✓</span>
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setConnectTarget({
                              id: post.authorId,
                              name: post.authorName,
                              handle: post.authorHandle,
                              avatar: post.authorAvatar,
                              role: post.authorType,
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}

                      {/* Hick's Law: Contextual More Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMoreMenuPostId(openMoreMenuPostId === post.id ? null : post.id);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMoreMenuPostId === post.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 w-44 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl p-1 z-30 animate-slide-up text-left"
                          >
                            <button
                              onClick={() => {
                                handleShareClick(post);
                                setOpenMoreMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Copy Link</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBlogPost(post);
                                setOpenMoreMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Read Article</span>
                            </button>
                            <button
                              onClick={() => {
                                setReportTarget({
                                  id: post.id,
                                  type: 'blog',
                                  title: post.blogTitle || post.content,
                                  ownerId: post.authorId,
                                  ownerName: post.authorName,
                                });
                                setOpenMoreMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Flag className="w-3.5 h-3.5 text-rose-400" />
                              <span>Report Blog</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>`;

// 2. Standard Card Header Actions (Remove Flag, Add Dominant Connect + More Menu)
const standardHeaderRegex = /<div className="flex items-center gap-2 shrink-0">[\s\S]*?<button[\s\S]*?setReportTarget\([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/div>/;

const standardHeaderReplacement = `<div className="flex items-center gap-2 shrink-0">
                    {connectionState === 'connected' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Connected ✓</span>
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setConnectTarget({
                            id: post.authorId,
                            name: post.authorName,
                            handle: post.authorHandle,
                            avatar: post.authorAvatar,
                            role: post.authorType,
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                    )}

                    {/* Hick's Law: Contextual More Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMoreMenuPostId(openMoreMenuPostId === post.id ? null : post.id);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMoreMenuPostId === post.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 w-44 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl p-1 z-30 animate-slide-up text-left"
                        >
                          <button
                            onClick={() => {
                              handleShareClick(post);
                              setOpenMoreMenuPostId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy Link</span>
                          </button>
                          {isOpportunity && opp && (
                            <button
                              onClick={() => {
                                setConnectTarget({
                                  id: post.authorId,
                                  name: post.authorName,
                                  handle: post.authorHandle,
                                  avatar: post.authorAvatar,
                                  role: post.authorType,
                                });
                                setOpenMoreMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Brief</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setReportTarget({
                                id: post.id,
                                type: isReel ? 'reel' : 'shot',
                                title: post.content,
                                ownerId: post.authorId,
                                ownerName: post.authorName,
                              });
                              setOpenMoreMenuPostId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Flag className="w-3.5 h-3.5 text-rose-400" />
                            <span>Report Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>`;

// 3. Progressive Caption Disclosure (Miller's Law / Rule 65)
const captionTarget = `                {/* Post Caption */}
                <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>`;

const captionReplacement = `                {/* Post Caption with Progressive Disclosure (Section 65) */}
                {(() => {
                  const isLong = post.content.length > 150;
                  const isExpanded = expandedCaptions[post.id];
                  const displayContent = isLong && !isExpanded ? \`\${post.content.slice(0, 150)}...\` : post.content;
                  return (
                    <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                      <span>{displayContent}</span>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => setExpandedCaptions((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="ml-1 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer inline-block"
                        >
                          {isExpanded ? 'less' : 'more'}
                        </button>
                      )}
                    </div>
                  );
                })()}`;

// 4. Streamlined Campaign Opportunity Card (Section 61 Tesler's Law)
const oppRegex = /{\/\* Classified Opportunity Box if Brand Brief attached \*\/}[\s\S]*?{isOpportunity && opp && \([\s\S]*?<\/div>\s*<\/div>\s*\)}/;

const oppReplacement = `{/* Streamlined Commercial Opportunity Brief (Section 61 Tesler's Law) */}
                {isOpportunity && opp && (
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Commercial Brief</span>
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[10px] text-zinc-400 font-mono truncate">{opp.requiredNiche}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{opp.title}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{opp.deliverablesSummary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {opp.budgetFormatted}
                      </span>
                      <button
                        onClick={() =>
                          setConnectTarget({
                            id: post.authorId,
                            name: post.authorName,
                            handle: post.authorHandle,
                            avatar: post.authorAvatar,
                            role: post.authorType,
                          })
                        }
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        View Brief →
                      </button>
                    </div>
                  </div>
                )}`;

// Normalize CRLF to LF for reliable matching
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedBlogHeaderTarget = blogHeaderTarget.replace(/\r\n/g, '\n');
const normalizedCaptionTarget = captionTarget.replace(/\r\n/g, '\n');

let updated = normalizedContent;

if (updated.includes(normalizedBlogHeaderTarget)) {
  updated = updated.replace(normalizedBlogHeaderTarget, blogHeaderReplacement);
  console.log('✓ Replaced Blog Header Actions');
} else {
  console.log('⚠️ Could not find exact blog header match');
}

if (standardHeaderRegex.test(updated)) {
  updated = updated.replace(standardHeaderRegex, standardHeaderReplacement);
  console.log('✓ Replaced Standard Header Actions');
} else {
  console.log('⚠️ Could not find standard header match');
}

if (updated.includes(normalizedCaptionTarget)) {
  updated = updated.replace(normalizedCaptionTarget, captionReplacement);
  console.log('✓ Replaced Caption with Progressive Disclosure');
} else {
  console.log('⚠️ Could not find caption target');
}

if (oppRegex.test(updated)) {
  updated = updated.replace(oppRegex, oppReplacement);
  console.log('✓ Replaced Commercial Opportunity Brief');
} else {
  console.log('⚠️ Could not find opportunity regex match');
}

fs.writeFileSync(targetPath, updated, 'utf8');
console.log('Finished updating DiscoverView.tsx');
